import express, { Router, Request, Response } from 'express';
import { requestLogger } from '../../middleware'
import { getProductById } from '../../services/dbService'

const router = Router();

// Define your routes
router.get('/:id', requestLogger, async (req: Request, res: Response) => {
  const productIdRequested = req?.params?.id;
  const retVal = await getProductById(productIdRequested);
  res.json(retVal);
});

export { router as productService };
