/* eslint-disable no-useless-escape */
import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    teamLeaderEmail: z.string({
      required_error: 'Team Leader Email is required.',
    }),
    password: z.string({ required_error: 'Password is required.' }),
  }),
});

const passwordMinLength = 8;

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required.',
    }),
    newPassword: z
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

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required.' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    teamLeaderEmail: z.string({
      required_error: 'Team Leader Email is required.',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    teamLeaderEmail: z.string({
      required_error: 'Team Leader Email is required.',
    }),
    newPassword: z
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

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
