import winston from 'winston';

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'cyan',
        verbose: 'blue',
        debug: 'magenta'
    },
};

winston.addColors(customLevels.colors);

const logPath: string = process.env.LOG_PATH || "logs/app.log";

const logger: winston.Logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'verbose'
        }),
        new winston.transports.File({
            filename: logPath, level: 'info'
        })
    ]
});

logger.info(`Big Bang - Logging everything at:${logPath}`);



export { logger };
