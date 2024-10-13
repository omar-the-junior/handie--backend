import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };

export default validate;
