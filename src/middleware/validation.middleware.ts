import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export type ValidationErrorResponseBody = {
  success: boolean;
  errors: {
    path: (string | number)[];
    message: string;
  }[];
};

const validate = <Params = unknown, ReqBody = unknown, ReqQuery = unknown>(
  schema: ZodSchema,
) => {
  const middleware: RequestHandler<
    Params,
    ValidationErrorResponseBody,
    ReqBody,
    ReqQuery
  > = (
    req: Request<Params, ValidationErrorResponseBody, ReqBody, ReqQuery>,
    res: Response<ValidationErrorResponseBody>,
    next: NextFunction,
  ) => {
    try {
      const parsedValues = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsedValues.body;
      req.query = parsedValues.query;
      req.params = parsedValues.params;

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

  return middleware;
};

export default validate;
