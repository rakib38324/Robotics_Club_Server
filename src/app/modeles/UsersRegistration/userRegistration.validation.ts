/* eslint-disable no-useless-escape */
import { z } from 'zod';

const passwordMinLength = 8;

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Username is required.' }).min(1).max(100),
    email: z.string({ required_error: 'Email is required.' }).email(),
    role: z.enum(['User', 'Manager']),
    password: z
      .string({ required_error: 'Password is required.' })
      .refine((data) => data.length >= passwordMinLength, {
        message: `Password must be at least ${passwordMinLength} characters long.`,
      })
      .refine((data) => /[a-z]/.test(data), {
        message: 'Password must contain at least one lowercase letter.',
      })
      .refine((data) => /[A-Z]/.test(data), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((data) => /\d/.test(data), {
        message: 'Password must contain at least one number.',
      })
      .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data), {
        message: 'Password must contain at least one special character.',
      }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().optional(),
    role: z.enum(['User', 'Manager']).optional(),
    password: z
      .string()
      .refine((data) => data.length >= passwordMinLength, {
        message: `Password must be at least ${passwordMinLength} characters long.`,
      })
      .refine((data) => /[a-z]/.test(data), {
        message: 'Password must contain at least one lowercase letter.',
      })
      .refine((data) => /[A-Z]/.test(data), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((data) => /\d/.test(data), {
        message: 'Password must contain at least one number.',
      })
      .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data), {
        message: 'Password must contain at least one special character.',
      }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
