import express, { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import exampleRouter from './routes/exampleRoutes'

dotenv.config();

const secretKey: string | undefined = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
}


const app = express();
app.use(express.json());

//Just random user interface
interface User {
    id: number;
    username: string;
    email: string;
}

//extend the Request interface to support my auth
declare global {
    namespace Express {
        interface Request {
            token: string;
            authData: any;
        }
    }
}


// Middleware to verify token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}


//Add all routers
app.use('/example', router);

//Base of the app
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req: Request, res: Response) => {
    jwt.verify(req.token, 'yourSecretKey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/api/login', (req: Request, res: Response) => {
    const user: User = {
        id: 1,
        username: 'john',
        email: 'john@gmail.com'
    }

    jwt.sign({ user }, secretKey, { expiresIn: '30m' }, (err, token) => {
        res.json({
            token
        });
    });
});

app.listen(5000, () => console.log('Server started on port 5000'));