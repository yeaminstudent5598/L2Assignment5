import { NextFunction, Request, Response, RequestHandler } from 'express';

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // সমাধান: Promise.resolve দিয়ে র‍্যাপ করা হয়েছে যাতে টাইপ সেফ থাকে
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;