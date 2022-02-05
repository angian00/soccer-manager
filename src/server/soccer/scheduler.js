const { createLogger, format, transports } = require("winston");
const logger = require('../logging');


class RoundRobinScheduler {
	constructor(teams) {
		this.teams = teams.slice(0);
		arrayShuffle(this.teams);

		this.buildRound();
		this.buildSecondRound();
		//this.checkFixtures();
		//this.printSchedule();
	}

	buildRound() {
		let nTeams = this.teams.length;
		let nDays = nTeams - 1;

		let rotatingList = this.teams.slice(1);
		this.days = [];

		for (let iDay=0; iDay < nDays; iDay++) {
			logger.debug("computing league day #%d", iDay);

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
			let newDay = [];
			for (let j=0; j < nTeams/2; j++) {
				if (iDay % 2 == 0) {
					newDay.push([visitor[j], home[j]]);
				} else {
					newDay.push([home[j], visitor[j]]);
				}
			}

			//logger.warn("newDay: %j", newDay);
			this.days.push(newDay);
			
			// ruota la lista, tenendo ferma la prima squadra {
			//  0 | 7 | 1 | 2   ->
			//  --------------   |
			//  6 | 5 | 4 | 3   <-
			rotatingList.unshift(rotatingList.pop());
		}

		// randomize fixture order
		arrayShuffle(this.days);
	}

	buildSecondRound() {
		let nDays = this.days.length;

		for (let iDay = 0; iDay < nDays; iDay ++) {
			let currDay = this.days[iDay];

			let newDay = [];
			for (let currMatch of currDay) {
				newDay.push([currMatch[1], currMatch[0]]);
			}
			this.days.push(newDay);
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
		for (let currDay of this.days) {
			for (let currMatch of currDay) {
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

	printSchedule() {
		let iDay = 1;
		for (let currDay of this.days) {
			console.log("---- Fixture #" + iDay + " ----");
			
			for (let currMatch of currDay) {
				console.log(currMatch[0] + " - " + currMatch[1]);
			}

			console.log("");
			iDay ++;
		}
	}

	getSchedule() {
		return this.days;
	}
}


function arrayShuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
}


module.exports = RoundRobinScheduler;

