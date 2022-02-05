const winston = require('winston');

const logger = winston.createLogger({
	level: "silly",
	format: winston.format.combine(
		winston.format.splat(),
		winston.format.simple()
	),
	transports: [ new winston.transports.Console() ]
});

logger.warn("winston logging initialized");

module.exports = logger;
