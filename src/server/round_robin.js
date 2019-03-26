const { createLogger, format, transports } = require("winston");

const logger = createLogger({
	format: format.combine(
		format.splat(),
		format.simple()
	),
    transports: [new transports.Console({ level: "debug" })]
});


class RoundRobinTournament {
	constructor(teams) {
		this.teams = teams.slice(0);
		arrayShuffle(this.teams);

		this.buildRound();
		this.buildSecondRound();
		//this.checkFixtures();
		this.printFixtures();
	}

	buildRound() {
		let nTeams = this.teams.length;
		let nFixtures = nTeams - 1;

		let rotatingList = this.teams.slice(1);
		this.fixtures = [];

		for (let iFixture=0; iFixture < nFixtures; iFixture++) {
			logger.debug("computing fixture #%d", iFixture);

			// accoppia i giocatori "ripiegando" la rotating list, 
			// ad es. per 8 giocatori:
			//  0 | 1 | 2 | 3
			//  --------------
			//  7 | 6 | 5 | 4

			let home = [this.teams[0]];
			home.push(...rotatingList.slice(0, nTeams/2 - 1));

			let visitor = rotatingList.slice(nTeams/2-1, nTeams);
			visitor.reverse();

			// assegna il turno, alternando casa e trasferta tra i turni
			let newFixture = [];
			for (let j=0; j < nTeams/2; j++) {
				if (iFixture % 2 == 0) {
					newFixture.push([visitor[j], home[j]]);
				} else {
					newFixture.push([home[j], visitor[j]]);
				}
			}

			//logger.warn("newFixture: %j", newFixture);
			this.fixtures.push(newFixture);
			
			// ruota la lista, tenendo ferma la prima squadra {
			//  0 | 7 | 1 | 2   ->
			//  --------------   |
			//  6 | 5 | 4 | 3   <-
			rotatingList.unshift(rotatingList.pop());
		}

		// randomize fixture order
		arrayShuffle(this.fixtures);
	}

	buildSecondRound() {
		let nFixtures = this.fixtures.length;

		for (let iFixture = 0; iFixture < nFixtures; iFixture ++) {
			let currFixture = this.fixtures[iFixture];

			let newFixture = [];
			for (let currMatch of currFixture) {
				newFixture.push([currMatch[1], currMatch[0]]);
			}
			this.fixtures.push(newFixture);
		}
	}

	checkFixtures() {
		let teamsMatchCount = {};

		for (let t of this.teams) {
			teamsMatchCount[t] = {};
			teamsMatchCount[t]['home'] = 0;
			teamsMatchCount[t]['visitor'] = 0;
		}

		let allMatches = new Set();
		for (let currFixture of this.fixtures) {
			for (let currMatch of currFixture) {
				// cerca matches duplicati (a meno dell'ordine dei due team)
				let normMatch = currMatch.slice(0).sort();

				if (allMatches.has(normMatch)) {
					logger.warn("duplicated match: %s", normMatch);
				}
				allMatches.add(normMatch);
				
				// calcola il no. di partite in casa e trasferta
				let homeTeam = currMatch[0];
				let visitorTeam = currMatch[1];
				teamsMatchCount[homeTeam]['home'] = teamsMatchCount[homeTeam]['home'] + 1;
				teamsMatchCount[visitorTeam]['visitor'] = teamsMatchCount[visitorTeam]['visitor'] + 1;
			}
		}

		logger.info("match count");
		logger.info("team | home | visitor | total");

		//calcola i totali e logga
		for (let t of this.teams) {
			teamsMatchCount[t]['total'] = teamsMatchCount[t]['home'] + teamsMatchCount[t]['visitor'];
			
			logger.info("%s | %s | %s | %s ", t, teamsMatchCount[t]['home'], 
				teamsMatchCount[t]['visitor'], teamsMatchCount[t]['total']);
		}
	}

	printFixtures() {
		let iFixture = 1;
		for (let currFixture of this.fixtures) {
			console.log("---- Fixture #" + iFixture + " ----");
			
			for (let currMatch of currFixture) {
				console.log(currMatch[0] + " - " + currMatch[1]);
			}

			console.log("");
			iFixture ++;
		}
	}
}


let teamList = [];
let nTeams = 20;
for (let iTeam=1; iTeam <=nTeams; iTeam ++) {
	teamList.push(iTeam.toString());
}

let rrt = new RoundRobinTournament(teamList);


//-----------------------------------
// utils
//-----------------------------------

function arrayShuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
}
