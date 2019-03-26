const model = require('../models/soccerModel');


exports.getLeague = (req, res) => {
	var leagueId = req.params.id;

	model.League.findOne({ where: {id: leagueId} }).then(league => {
		res.json(league);
	}).catch(err => {
		res.status(500).send("Database error: " + err);
	});
};

exports.createLeague = (req, res) => {
	return model.sequelize.transaction(t => {
		return model.League.create({
			name: req.body.name,
			description: req.body.description
		}, {transaction: t}).then( (newLeague) => {
			let newLeagueId = newLeague.id;

			let teamPromises = [];
			for (let teamName of req.body.teams) {
				teamPromises.push(
					model.Team.create({
						name: teamName,
						leagueId: newLeagueId
					}, {transaction: t}).then( team => {
						team.setLeague(newLeague);
					})
				);
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
		res.status(500).send("Database error: " + err);
	});
};

