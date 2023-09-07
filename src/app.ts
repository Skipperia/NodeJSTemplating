import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { apiRouter } from './routes';
import { requestLogger, securiryMiddleWares } from './middleware';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';



dotenv.config();

const secretKey: string | undefined = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
}

const app = express();
const appWs = expressWs(app);
app.use(express.json());
const connectedWebsocketClients: WebSocket[] = [];

//Add all routers
app.use('/api', securiryMiddleWares.tokenAuth, securiryMiddleWares.sanitizeRequest, requestLogger, apiRouter);

app.get('/about', (req: Request, res: Response) => {
    logger.verbose("About route called");
    res.json({
        message: 'Welcome to the About page'
    });
});

//Base of the app
app.get('/', (req: Request, res: Response) => {
    connectedWebsocketClients.forEach(item => item.send("called out base"))
    logger.verbose("Base route called");
    res.json({
        message: 'Welcome to the API'
    });
});


appWs.app.ws('/websocket', (ws: WebSocket, req) => {
    connectedWebsocketClients.push(ws);
    ws.on('open', () => {
        ws.send("Connected to websocket!!!");
    });
    ws.on('message', (message: string) => {
        ws.send("ayyy");
    });

    ws.on('close', () => {
        const index = connectedWebsocketClients.indexOf(ws);
        if (index !== -1) {
            connectedWebsocketClients.splice(index, 1);
        }
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