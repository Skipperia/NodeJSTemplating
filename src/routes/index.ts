import * as express from "express";


//import all the sub-routers
import { productService } from './main/productService';

const router = express.Router();

//add the sub-routers to their respective routes
router.use('/product', productService);

export { router as apiRouter };