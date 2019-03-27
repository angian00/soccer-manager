const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./db/soccer.db",
	define: {
		timestamps: false,
		freezeTableName: true,
		underscored: true
	}
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully");
	})
	.catch(err => {
		console.error("Unable to connect to the database:", err);
	});


class League extends Sequelize.Model {}
League.init({
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.STRING
		}
	}, {
	sequelize,
});



class Team extends Sequelize.Model {}
Team.init({
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
	}, {
	sequelize,
});

League.hasMany(Team, { foreignKey: "leagueId" });
Team.belongsTo(League, { foreignKey: "leagueId" });


class Fixture extends Sequelize.Model {}
Fixture.init({
		year: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		day: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		played: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		homeGoals: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		visitorGoals: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
	}, {
	sequelize,
});

League.hasMany(Fixture, { foreignKey: "leagueId" });
Fixture.belongsTo(League, { foreignKey: "leagueId" });

Team.hasMany(Fixture, { foreignKey: "homeTeam" });
Team.hasMany(Fixture, { foreignKey: "visitorTeam" });
Fixture.belongsTo(Team, { foreignKey: "homeTeam" });
Fixture.belongsTo(Team, { foreignKey: "visitorTeam" });


League.sync();
Team.sync();
Fixture.sync();

exports.League = League;
exports.Team = Team;
exports.Fixture = Fixture;

exports.sequelize = sequelize;
