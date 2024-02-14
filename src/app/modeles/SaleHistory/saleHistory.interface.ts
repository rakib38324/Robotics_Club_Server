import { Types } from 'mongoose';

export type TSaleHistory = {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  buyerName: string;
  quantity: number;
  saleDate: string;
};
