import { createLogger, transports, format, addColors } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
	level: 'info',
	format: combine(colorize(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SS' }), myFormat),
	// defaultMeta: { service: 'user-service' },
	transports: [
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
	],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// if (process.env.NODE_ENV !== 'production') {
logger.add(
	new transports.Console({
		format: combine(colorize(), myFormat),
		level: 'debug',
	})
);
// }

addColors({
	error: 'red',
	warn: 'yellow',
	info: 'cyan',
	debug: 'green',
});

logger.info(`logger is up NODE_ENV = ${process.env.NODE_ENV}`);

export default logger;
