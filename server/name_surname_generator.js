const readline = require('readline');
const fs = require('fs');


const firstNameFile = "resources/nomi_italiani.txt";
const surnameFile = "resources/cognomi_italiani.txt";

var firstNames = [];
var nFirstNames = 0;

var surnames = [];
var nSurnames = 0;


let rl = readline.createInterface({
	input: fs.createReadStream(firstNameFile)
});

rl.on('line', function(line) {
	nFirstNames ++;
	firstNames.push(line);
});

rl.on('close', function(line) {
	console.log("Read # " + nFirstNames + " lines from file " + firstNameFile);
});


let rl2 = readline.createInterface({
	input: fs.createReadStream(surnameFile)
});

rl2.on('line', function(line) {
	nSurnames ++;
	surnames.push(line);
});

rl2.on('close', function(line) {
	console.log("Read # " + nSurnames + " lines from file " + surnameFile);
});


function generateFullName() {
	return firstNames[Math.floor(Math.random() * nFirstNames)] + " " + 
		surnames[Math.floor(Math.random() * nSurnames)];
}


setTimeout(() => { console.log(generateFullName())}, 1000);

