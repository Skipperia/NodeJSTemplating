import * as express from "express";


//import all the sub-routers
import { exampleRouter } from './main/exampleRoutes';

const router = express.Router();

//add the sub-routers to their respective routes
router.use('/example', exampleRouter);

export { router as apiRouter };