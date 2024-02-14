import { Schema, model } from 'mongoose';
import { TSaleHistory } from './saleHistory.interface';

const SaleHistorySchema = new Schema<TSaleHistory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: { type: String, required: true },
    quantity: { type: Number, required: true },
    saleDate: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const SaleHistory = model<TSaleHistory>(
  'SaleHistorie',
  SaleHistorySchema,
);
