import { NextFunction, Request, Response } from "express"

const basicAuth = (Request: Request, Response: Response, next: NextFunction) => {
    //add auth here
    next();
}

const tokenAuth = (Request: Request, Response: Response, next: NextFunction) => {
    //add token auth here
    next();
}

const sanitizeRequest = () => { };

export {
    basicAuth,
    tokenAuth
}
