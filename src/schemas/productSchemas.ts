import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    title: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    categories: z
      .array(z.coerce.number().nonnegative())
      .or(z.coerce.number())
      .optional(),
    sellerId: z.coerce.number().nonnegative().optional(),
    priceSortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type GetProductsInputType = z.infer<typeof getProductsSchema>;

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
});

export type GetProductByIdInputType = z.infer<typeof getProductByIdSchema>;
