import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { apiRouter } from './routes';
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