import express, {Request, Response} from 'express';
import {WebSocket} from 'ws';
import http from 'http';
import dotenv from 'dotenv';

import {logger} from './utils/logger';
import {apiRouter} from './routes';
import {requestLogger, securiryMiddleWares} from './middleware';


dotenv.config();
const secretKey: string | undefined = process.env.SECRET_KEY;
if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
}

//app server init
const app = express();
const server = http.createServer(app);
app.use(express.json());

//websocket map - move to somewhere else
const connectedWebsocketClients: WebSocket[] = [];
const activeSessions = new Map();
const wss = new WebSocket.Server({server});

//add all routers
app.use('/api', securiryMiddleWares.tokenAuth, securiryMiddleWares.sanitizeRequest, requestLogger, apiRouter);

app.get('/about', (req: Request, res: Response) => {
    logger.verbose("About route called");
    res.json({
        message: 'about page'
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


wss.on('connection', (ws, req) => {
    const sessionToken: string = req.headers['sec-websocket-protocol'] as string;
    if (sessionToken) { // check session token
        activeSessions.set(sessionToken, ws);
        ws.on('message', (message) => {
            console.log("ayy got message message")
        });
        ws.on('close', () => {
            activeSessions.delete(sessionToken);
        });
    } else {
        ws.close(4000, 'Invalid session');
    }
});


server.listen(5000, () => logger.info('Server started on port 5000'));


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