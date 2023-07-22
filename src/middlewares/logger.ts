import { Response, Request, NextFunction } from "express";
import { logger } from '../utils/logger';

const requestLogger = (Request: Request, Response: Response, next: NextFunction) => {
    logger.verbose("A request happened :)");
    next();
}


const errorHandler = (Request: Request, Response: Response, next: NextFunction) => {
    logger.verbose("An error happened :'(");
    Response.status(500).send('An error happened :(((')
}

export default {
    requestLogger,
    errorHandler
}