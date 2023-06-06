import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import winston from 'winston';
import { apiRouter } from './routes';

dotenv.config();

const secretKey: string | undefined = process.env.SECRET_KEY;
const logPath: string = process.env.LOG_PATH || "logs/app.log";

if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logPath })
        
    ]
});

logger.info(`Big Bang - Logging everything at:${logPath}`);

const app = express();
app.use(express.json());


//Add all routers
app.use('/api', apiRouter);

//Base of the app
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to the API'
    });
});


app.listen(5000, () => console.log('Server started on port 5000'));