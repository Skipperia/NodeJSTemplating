import { Response, Request, NextFunction, RequestHandler } from "express";
import { logger } from '../utils/logger';

const requestLogger: RequestHandler = (Request: Request, Response: Response, next: NextFunction) => {
    logger.verbose("A request happened :-)");
    next();
}


const errorHandler: RequestHandler = (Request: Request, Response: Response, next: NextFunction) => {
    logger.verbose("An error happened :'(");
    Response.status(500).send('An error happened :(((')
}

export {
    requestLogger,
    errorHandler
}