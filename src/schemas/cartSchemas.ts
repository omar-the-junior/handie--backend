import { z } from 'zod';

export const AddToCartInputSchema = z.object({
  body: z.object({
    productId: z.number().int().nonnegative(),
  }),
});

export type AddToCartInputType = z.infer<typeof AddToCartInputSchema>;

export const CartItemInputSchema = z.object({
  body: z.object({
    cartItemId: z.number().int().nonnegative(),
  }),
});

export type CartItemInputType = z.infer<typeof CartItemInputSchema>;
