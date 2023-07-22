import express, { Router, Request, Response } from 'express';
import { requestLogger } from '../../middlewares'
import { getProductById } from '../../services/dbService'

const router = Router();

// Define your routes
router.get('/', requestLogger, async (req: Request, res: Response) => {
  await getProductById("");
  res.send('This is the product route.');
});

export { router as productService };
