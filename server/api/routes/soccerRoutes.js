module.exports = function(app) {
	var soccer = require('../controllers/soccerController');

	app.route('/api/league/create')
		.post(soccer.createLeague);

	// app.route('/api/league/newYear')
	// 	.post(soccer.newLeagueYear);
};
