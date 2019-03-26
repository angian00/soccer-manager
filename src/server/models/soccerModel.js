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

exports.League = League;


class Team extends Sequelize.Model {}
Team.init({
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
	}, {
	sequelize,
});

League.hasMany(Team, { foreignKey: 'league_id' });
Team.belongsTo(League, { foreignKey: 'league_id' });


exports.League = League;
exports.Team = Team;
exports.sequelize = sequelize;
