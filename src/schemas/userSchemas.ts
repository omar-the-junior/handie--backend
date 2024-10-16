import { z } from 'zod';

// Define the login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  }),
});
export type LoginReqType = z.infer<typeof loginSchema>;

// Define the signup schema
export const signupSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    repeatPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string().min(1, { message: 'Name is required' }),
  }),
});

export const UpdateUserProfileInputSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
  }),
});

export type UpdateUserProfileInputType = z.infer<
  typeof UpdateUserProfileInputSchema
>;

export type SignupReqType = z.infer<typeof signupSchema>;
