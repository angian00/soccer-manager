const readline = require('readline');
const fs = require('fs');

const logger = require('../logging');


class NameGenerator {

	constructor(nameFile) {
		this.nameFile = nameFile;
	}


	initialize() {
		let self = this;
		let allNames = [];
		let rl = readline.createInterface({
			input: fs.createReadStream(this.nameFile)
		});


		rl.on('line', function(line) {
			allNames.push(line);
		});

		return new Promise(resolve => {
			rl.on('close', function(line) {
				self.allNames = allNames;
				resolve();
			});
		});
	}

	generateName() {
		let randomIndex = Math.floor(Math.random() * this.allNames.length);

		return this.allNames.splice(randomIndex, 1)[0];
	}

	getSize() {
		return this.allNames.length;
	}

}

module.exports = NameGenerator;
