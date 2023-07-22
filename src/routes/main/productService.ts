import express, { Router, Request, Response } from 'express';
import requestLogger from '../../middlewares'

const router = Router();

// Define your routes
router.get('/', (req: Request, res: Response) => {
  res.send('This is the product route.');
});

export { router as productService };
