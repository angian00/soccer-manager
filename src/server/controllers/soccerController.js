const logger = require('../logging');
const model = require('../models/soccerModel');

const Scheduler = require('../soccer/scheduler');


exports.getAllLeagues = (req, res) => {
	model.League.findAll({}).then(leagues => {
		res.json(leagues);
	}).catch(err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};

exports.getLeague = (req, res) => {
	let leagueId = parseInt(req.params.id);

	model.League.findOne({ where: {id: leagueId} }).then(league => {
		if (league) {
			res.json(league);
		} else {
			res.status(404).send("League with id: " + leagueId + " not found");		
		}
	}).catch(err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};

exports.createLeague = (req, res) => {
	logger.info("createLeague: %j", req.body);

	return model.sequelize.transaction(t => {
		return model.League.create({
			name: req.body.name,
			description: req.body.description
		}, {transaction: t}).then( (newLeague) => {
			let newLeagueId = newLeague.id;

			let teamPromises = [];
			if (req.body.teams) {
				for (let teamName of req.body.teams) {
					teamPromises.push(
						model.Team.create({
							name: teamName,
							leagueId: newLeagueId
						}, {transaction: t})
					);
				}
			}

			return Promise.all(teamPromises).then( () => {
				return newLeagueId;
			}).catch( err => {
				throw err;
			});
		});

	}).then( newLeagueId => {
		res.send("New League created with id: " + newLeagueId);
	}).catch( err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};

exports.updateLeague = (req, res) => {
	let leagueId = parseInt(req.params.id);

	model.League.update({ name: req.body.name, description: req.body.description },  { where: { id: leagueId }
	}).then(arrNUpdated => {
		let nUpdated = arrNUpdated[0];

		if (nUpdated == 1) {
			res.send("League with id: " + leagueId + " successfully updated");
		} else {
			res.status(404).send("League with id: " + leagueId + " not found");
		}
	}).catch( err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};


exports.deleteLeague = (req, res) => {
	let leagueId = parseInt(req.params.id);

	return model.sequelize.transaction(t => {
		model.Team.destroy({ where: {league_id: leagueId} }, {transaction: t})
			.then(nDeletedRecords => {
				model.League.destroy({ where: {id: leagueId} }, {transaction: t})
					.then(nDeletedRecords => {
						if (nDeletedRecords == 1) {
							res.send("League with id: " + leagueId + " successfully deleted");    
						} else {
							res.status(404).send("League with id: " + leagueId + " not found");
						}
					});
			});
		//TODO: cascade on fixtures
	}).catch(err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};


exports.newLeagueYear = (req, res) => {
	let leagueId = parseInt(req.params.id);

	return model.sequelize.transaction(t => {
		return model.League.findOne({ where: {id: leagueId}, include: [ model.Team ], transaction: t}).then(league => {
			if (!league) {
				res.status(404).send("League with id: " + leagueId + " not found");		
			
			} else {
				let pTeams = league.getTeams().then(teams => {
					let teamIds = [];

					for (let t of teams) {
						teamIds.push(t.id);
					}

					return teamIds;
				});

				let pYear = model.Fixture.max("year", { where: { league_id: leagueId} });

				return Promise.all([pTeams, pYear]).then(pValues => {
					let teamIds = pValues[0];
					let maxYear = pValues[1];

					let nextYear = 1;
					if (maxYear) {
						nextYear = maxYear + 1;
					}

					let s = new Scheduler(teamIds);
					let schedule = s.getSchedule();

					let fixturePromises = [];
					for (let iDay in schedule) {
						//logger.info("---- day #%d ", (iDay+1));
						for (let currMatch of schedule[iDay]) {
							//logger.info("%s - %s", currMatch[0], currMatch[1]);
							let homeTeamId = currMatch[0];
							let visitorTeamId = currMatch[1];

							fixturePromises.push(model.Fixture.create({ year:  nextYear, day: iDay, 
								leagueId: leagueId, homeTeam: homeTeamId, visitorTeam: visitorTeamId }, {transaction: t}));
						}
					}

					return Promise.all(fixturePromises).then( () => {
						return nextYear;
					}).catch( err => {
						throw err;
					});
				});
			}
		});

	}).then( newYear => {
		res.send("Year " + newYear + " initialized");
	}).catch(err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
};
