import { z } from 'zod';

export const AddToWishlistInputSchema = z.object({
  body: z.object({
    productId: z.number().int().nonnegative(),
  }),
});

export type AddToWishlistInputType = z.infer<typeof AddToWishlistInputSchema>;

export const WishlistItemInputSchema = z.object({
  body: z.object({
    wishlistItemId: z.number().int().nonnegative(),
  }),
});

export type WishlistItemInputType = z.infer<typeof WishlistItemInputSchema>;
