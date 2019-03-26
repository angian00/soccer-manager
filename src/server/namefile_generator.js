const readline = require('readline');
const fs = require('fs');


const nameFile = "resources/sampled_imdb_names.txt";

var allNames = [];
var nNames = 0;


let rl = readline.createInterface({
	input: fs.createReadStream(nameFile)
});


rl.on('line', function(line) {
	nNames ++;
	allNames.push(line);
});

rl.on('close', function(line) {
	console.log("Read # " + nNames + " lines from file " + nameFile);
});


function generateName() {
	let randomIndex = Math.floor(Math.random() * nNames);

	return allNames[randomIndex];
}


setTimeout(() => { console.log(generateName())}, 1000);

