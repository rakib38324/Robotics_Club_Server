import { z } from 'zod';

const createSaleHistoryValidationSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    buyerName: z.string().min(1),
    quantity: z.number().int().positive().min(1),
    saleDate: z.string().min(1),
  }),
});

const updateSaleHistoryValidationSchema = z.object({
  body: z.object({
    productId: z.string().min(1).optional(),
    sellerId: z.string().min(1).optional(),
    buyerName: z.string().min(1).optional(),
    quantity: z.number().int().positive().min(1).optional(),
    saleDate: z.string().min(1).optional(),
  }),
});

export const saleHistoryValidations = {
  createSaleHistoryValidationSchema,
  updateSaleHistoryValidationSchema,
};
