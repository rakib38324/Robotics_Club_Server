/* eslint-disable no-useless-escape */
import { z } from 'zod';

const passwordMinLength = 8;

const TeamMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10), // assuming phone number should have at least 10 characters
});

const createUserValidationSchema = z.object({
  body: z.object({
    teamName: z.string({ required_error: 'Team Name is required.' }).min(1),
    segment: z.enum(['Project Showcase', 'LFR', 'Soccer Boot']),
    role: z.enum(['User', 'Admin']),
    projectName: z
      .string({ required_error: 'Project Name is required.' })
      .optional(),
    projectDescription: z.string().max(200).optional(),
    teamLeaderName: z
      .string({ required_error: 'Team Leader Name is required.' })
      .min(1),
    teamLeaderEmail: z
      .string({ required_error: 'Team Leader Email is required.' })
      .email(),
    teamLeaderPhoneNumber: z
      .string({ required_error: 'Team Leader Phone number is required.' })
      .min(10), // assuming phone number should have at least 10 characters
    teamLeaderFacebookID: z.string({
      required_error: 'Team Facebook Id is required.',
    }),
    teamMembers_1_name: z
      .string({ required_error: 'Team member_1 Name is required.' })
      .min(1),
    teamMembers_1_email: z
      .string({ required_error: 'Team member_1 Email is required.' })
      .min(1),
    teamMembers_1_phoneNumber: z
      .string({ required_error: 'Team member_1 Phone Number is required.' })
      .min(1),
    teamMembers_2_name: z
      .string({ required_error: 'Team member_2 Name is required.' })
      .min(1),
    teamMembers_2_email: z
      .string({ required_error: 'Team member_2 Email is required.' })
      .min(1),
    teamMembers_2_phoneNumber: z
      .string({ required_error: 'Team member_ Phone Number is required.' })
      .min(1),
    transactionID: z.string().min(1),
    sandMoneyNumber: z.string().min(1),
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
    segment: z.enum(['Project Showcase', 'LFR', 'Soccer Boot']).optional(),
    teamName: z.string().min(1).optional(),
    projectName: z.string().optional(),
    projectDescription: z.string().max(200).optional(),
    teamLeaderName: z.string().min(1).optional(),
    teamLeaderEmail: z.string().email().optional(),
    teamLeaderPhoneNumber: z.string().min(10).optional(), // assuming phone number should have at least 10 characters
    teamLeaderFacebookID: z.string().optional(),
    teamMembers_1: TeamMemberSchema.optional(),
    teamMembers_2: TeamMemberSchema.optional(),
    transactionID: z.string().min(1).optional(),
    sandMoneyNumber: z.string().min(1).optional(),
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
      })
      .optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
