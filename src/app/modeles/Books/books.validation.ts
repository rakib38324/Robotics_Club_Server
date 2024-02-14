import { z } from 'zod';

//=============>  Define a Zod validation schema for the Book model
const createBookValidationSchema = z.object({
  body: z.object({
    image: z.string().min(1),
    name: z
      .string({
        invalid_type_error: 'Name must be a string.',
      })
      .min(1),
    quantity: z.number().int().min(1),
    Price: z.number().min(1),
    ReleaseDate: z.string().min(1),
    Author: z.string().min(1),
    ISBN: z.string().min(1),
    Genre: z.enum([
      'Fiction',
      'Mystery',
      'Science Fiction',
      'Romance',
      'Biography',
      'Self-help',
      'History',
      'Thriller',
      'Fantasy',
      'Non-fiction',
    ]),
    Publisher: z.string().min(1),
    Series: z.string().min(1),
    Language: z.string().min(1),
    bookFormate: z.enum(['E-Book', 'Hard Copy', 'Audio-Book']),
  }),
});

const updateBookValidationSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z
      .string({
        invalid_type_error: 'Name must be a string.',
      })
      .optional(),
    quantity: z.number().int().optional(),
    Price: z.number().optional(),
    ReleaseDate: z.string().optional(),
    Author: z.string().optional(),
    ISBN: z.string().optional(),
    Genre: z
      .enum([
        'Fiction',
        'Mystery',
        'Science Fiction',
        'Romance',
        'Biography',
        'Self-help',
        'History',
        'Thriller',
        'Fantasy',
        'Non-fiction',
      ])
      .optional(),
    Publisher: z.string().optional(),
    Series: z.string().optional(),
    Language: z.string().optional(),
    bookFormate: z.enum(['E-Book', 'Hard Copy', 'Audio-Book']).optional(),
  }),
});

export const BookValidations = {
  createBookValidationSchema,
  updateBookValidationSchema,
};
