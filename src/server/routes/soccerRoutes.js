module.exports = function(app) {
	var soccer = require("../controllers/soccerController");

	app.route("/api/leagues")
		.get(soccer.getAllLeagues);

	app.route("/api/league/:id")
		.get(soccer.getLeague);

	app.route("/api/league/create")
		.post(soccer.createLeague);

	app.route("/api/league/:id/update")
		.post(soccer.updateLeague);

	app.route("/api/league/:id/delete")
		.post(soccer.deleteLeague);

	app.route("/api/league/:id/newYear")
		.post(soccer.newLeagueYear);

//	app.route("/api/league/:id/nextFixtures")
//		.get(soccer.nextFixtures);
};
""