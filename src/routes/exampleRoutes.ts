import express, { Router, Request, Response } from 'express';


const exampleRouter: Router = Router();

// Define your routes
exampleRouter.get('/', (req: Request, res: Response) => {
  res.send('This is the example route.');
});

export default exampleRouter;