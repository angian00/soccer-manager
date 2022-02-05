const logger = require('../logging');
const model = require('../models/soccerModel');

const Scheduler = require('../soccer/scheduler');
const NameGenerator = require('../soccer/name_generator');


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
	let computeScoreboard = req.query.computeScoreboard || "false";

	model.League.findOne({ where: {id: leagueId}, include: [ model.Team, model.Fixture ] }).then(league => {
		if (league) {
			// NB: converts to plain object, not json string
			league = league.toJSON();

			if (!league.Fixtures.length) {
				league.currYear = null;
				league.schedule = [];
				league.results = [];

			} else {
				let currYear = Math.max.apply(Math, league.Fixtures.map(function(f) { return f.year; }));

				let teamId2Name = {};
				for (let t of league.Teams) {
					teamId2Name[t.id] = t.name;
				}


				let schedule = {};
				let results = {};
				for (let f of league.Fixtures) {
					if (f.year != currYear)
						continue;

					f.homeTeam = teamId2Name[f.homeTeam];
					f.visitorTeam = teamId2Name[f.visitorTeam];

					if (f.played) {
						if (!results[f.day])
							results[f.day] = [];

						results[f.day].push(f);

					} else {
						if (!schedule[f.day])
							schedule[f.day] = [];

						schedule[f.day].push(f);
					}
				}

				if (computeScoreboard == "true") {
					let scoreboardMap = {};
					for (let t of league.Teams) {
						scoreboardMap[t.name] = { "team": t.name, "nPoints": 0, 
							"nPlayed": 0, "nWon": 0, "nLost": 0, "nDrawn": 0, 
							"goalsFor": 0, "goalsAgainst": 0};
					}

					for (let day in results) {
						for (let f of results[day]) {
							scoreboardMap[f.homeTeam]["nPlayed"] ++;
							scoreboardMap[f.homeTeam]["goalsFor"] += f.homeGoals;
							scoreboardMap[f.homeTeam]["goalsAgainst"] += f.visitorGoals;
							scoreboardMap[f.visitorTeam]["nPlayed"] ++;
							scoreboardMap[f.visitorTeam]["goalsFor"] += f.visitorGoals;
							scoreboardMap[f.visitorTeam]["goalsAgainst"] += f.homeGoals;

							if (f.homeGoals > f.visitorGoals) {
								scoreboardMap[f.homeTeam]["nWon"] ++;
								scoreboardMap[f.homeTeam]["nPoints"] += 3;
								scoreboardMap[f.visitorTeam]["nLost"] ++;

							} else if (f.homeGoals > f.visitorGoals) {
								scoreboardMap[f.homeTeam]["nLost"] ++;
								scoreboardMap[f.visitorTeam]["nWon"] ++;
								scoreboardMap[f.visitorTeam]["nPoints"] += 3;

							} else {
								scoreboardMap[f.homeTeam]["nDrawn"] ++;
								scoreboardMap[f.homeTeam]["nPoints"] += 1;
								scoreboardMap[f.visitorTeam]["nDrawn"] ++;
								scoreboardMap[f.visitorTeam]["nPoints"] += 1;
							}
						}
					}

					//compute ranking
					let scoreboard = Object.keys(scoreboardMap).map( (key) => scoreboardMap[key] );
					scoreboard.sort( (t1, t2) => {
						if (t1.nPoints < t2.nPoints)
							return 1;
						else if (t1.nPoints > t2.nPoints)
							return -1;
						else
							//tie-break: goal difference
							return (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
					});

					league.scoreboard = scoreboard;
				}

				delete league.Fixtures;
				
				league.currYear = currYear;
				league.schedule = schedule;
				league.results = results;

				//logger.warn("league before send: %j", league);
			}

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

			let teamGenerator = null;

			if (req.body.teams) {
				teamGenerator = new Promise(() => req.body.teams);
			} else {
				let teamNameGenerator = new NameGenerator("resources/squadre_serie_a.txt");
				teamGenerator = teamNameGenerator.initialize().then(() => {
					let nTeams = 20;
					let teamNames = [];
					for (let i=0; i < nTeams; i++) {
						teamNames.push(teamNameGenerator.generateName());
					}

					return teamNames;
				});
			}


			return teamGenerator.then(teamNames => {
				let teamPromises = [];
				for (let teamName of teamNames) {
					logger.warn("teamName: %j", teamName);
					teamPromises.push(
						model.Team.create({
							name: teamName,
							leagueId: newLeagueId
						}, {transaction: t})
					);
				}

				return Promise.all(teamPromises).then( () => {
					return newLeagueId;
				}).catch( err => {
					throw err;
				});
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
		model.Fixture.destroy({ where: {league_id: leagueId} }, {transaction: t}).then(nDeletedRecords => {
			model.Team.destroy({ where: {league_id: leagueId} }, {transaction: t}).then(nDeletedRecords => {
				model.League.destroy({ where: {id: leagueId} }, {transaction: t}).then(nDeletedRecords => {
					if (nDeletedRecords == 1) {
						res.send("League with id: " + leagueId + " successfully deleted");    
					} else {
						res.status(404).send("League with id: " + leagueId + " not found");
					}
				});
			});

		});

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
					for (let iDay=0; iDay < schedule.length; iDay ++) {
						//logger.info("---- day #%d ", (iDay+1));
						for (let currMatch of schedule[iDay]) {
							//logger.info("%s - %s", currMatch[0], currMatch[1]);
							let homeTeamId = currMatch[0];
							let visitorTeamId = currMatch[1];

							fixturePromises.push(model.Fixture.create({ year:  nextYear, day: (iDay+1), 
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


exports.generateResults = (req, res) => {
	let leagueId = parseInt(req.params.id);

	return model.sequelize.transaction(t => {
		return model.League.findOne({ where: {id: leagueId}, include: [ model.Team, model.Fixture ], transaction: t}).then(league => {
			if (!league) {
				res.status(404).send("League with id: " + leagueId + " not found");		
			
			} else {
				logger.info("generating day results");
				let currYear = Math.max.apply(Math, league.Fixtures.map(f => f.year));
				let currDay = Math.min.apply(Math, league.Fixtures.filter(f => (f.year == currYear) && (!f.played)).map(f => f.day));

				if ( (!currYear) || (!currDay) ) {
					//fail
					return [currYear, currDay];
				}

				let teamMap = {};
				for (let t of league.Teams) {
					teamMap[t.id] = t;
				}

				let currFixtures = league.Fixtures.filter(f => (f.year == currYear) && (f.day == currDay));

				let fixturePromises = [];
				for (let f of currFixtures) {
					let gameResult = simulateGame(teamMap[f.homeTeam], teamMap[f.visitorTeam]);

					fixturePromises.push(f.update({ played: true, homeGoals: gameResult.homeGoals, 
						visitorGoals: gameResult.visitorGoals }, {transaction: t}));
				}

				return Promise.all(fixturePromises).then( () => {
					return [currYear, currDay];
				}).catch( err => {
					throw err;
				});
			}
		});

	}).then( generateObj => {
		let currYear = generateObj[0];
		let currDay = generateObj[1];

		if ((!currYear) || (!currDay)) {
			logger.warn("Could not generate results for given league");
			res.status(400).send("Could not generate results for given league");

		} else {
			res.send("Generated results for year " + currYear + ", day " + currDay);
		}

	}).catch(err => {
		logger.error(err);
		res.status(500).send("Database error: " + err);
	});
}


function simulateGame(homeTeam, visitorTeam) {
	const maxGoals = 3;
	//TODO: improve simulator
	return {
		//homeGoals:    Math.floor(Math.random() * (maxGoals + 1)), 
		//visitorGoals: Math.floor(Math.random() * (maxGoals + 1))
		homeGoals:    randomPoisson(1.5),
		visitorGoals:    randomPoisson(1.0),
	}
}


function randomPoisson(mean) {
	let L = Math.exp(-mean);
	let p = 1.0;
	let k = 0;

	do {
		k++;
		p *= Math.random();
	} while (p > L);

	return (k-1);
}
