

DROP TABLE IF EXISTS fixture;
-- DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS league;

CREATE TABLE league(
	id INTEGER PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description TEXT
);

CREATE TABLE team(
	id INTEGER PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	league_id INTEGER,

	FOREIGN KEY(league_id) REFERENCES league(id)
);

-- CREATE TABLE player(
-- 	id INTEGER PRIMARY KEY,
-- 	name VARCHAR(50) NOT NULL,
-- 	league_id INTEGER,
	
-- 	-- TODO: add skill stats...

-- 	FOREIGN KEY(league_id) REFERENCES league(id),
-- 	FOREIGN KEY(team_id) REFERENCES team(id)
-- );


CREATE TABLE fixture(
	id INTEGER PRIMARY KEY,
	league_id INTEGER,
	year INTEGER NOT NULL,
	round INTEGER NOT NULL,
	home_team INTEGER,
	visitor_team INTEGER,
	played BOOLEAN DEFAULT FALSE NOT NULL,
	home_goals INTEGER,
	visitor_goals INTEGER,

	FOREIGN KEY(league_id) REFERENCES league(id),
	FOREIGN KEY(home_team) REFERENCES team(id),
	FOREIGN KEY(visitor_team) REFERENCES team(id)
);
