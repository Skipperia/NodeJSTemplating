import express, { Router, Request, Response } from 'express';

const router = Router();


// Define your routes
router.get('/', (req: Request, res: Response) => {
  res.send('This is the example route.');
});

export { router as exampleRouter };
