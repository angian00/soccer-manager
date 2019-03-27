module.exports = function(app) {
	var soccer = require('../controllers/soccerController');

	app.route('/api/league')
		.get(soccer.getAllLeagues);

	app.route('/api/league/:id')
		.get(soccer.getLeague);

	app.route('/api/league/create')
		.post(soccer.createLeague);

	app.route('/api/league/update/:id')
		.post(soccer.updateLeague);

	app.route('/api/league/delete/:id')
		.post(soccer.deleteLeague);

	app.route('/api/league/newYear/:id')
		.post(soccer.newLeagueYear);
};
