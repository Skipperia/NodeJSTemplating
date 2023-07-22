import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { apiRouter } from './routes';
import requestLogger from './middlewares'
dotenv.config();

const secretKey: string | undefined = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
}

const app = express();
app.use(express.json());


//Add all routers
app.use('/api', apiRouter);

//Base of the app
app.get('/', (req: Request, res: Response) => {
    logger.verbose("Base route called");
    res.json({
        message: 'Welcome to the API'
    });
});


app.listen(5000, () => logger.info('Server started on port 5000'));



process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', function (err) {
    logger.error('Caught exception: ' + err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
});