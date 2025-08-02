import { NextFunction, Request, Response } from 'express';
import { z, ZodError, ZodObject, ZodRawShape } from 'zod';

// Generic validation middleware
export const validationRequest = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: err.issues,
        });
      }

      next(err);
    }
  };
};
