import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TSaleHistory } from './saleHistory.interface';
import { SaleHistory } from './saleHistory.model';
import { JwtPayload } from 'jsonwebtoken';
import { Book } from '../Books/books.model';

const createSaleHistroyIntoDB = async (
  user: JwtPayload,
  payload: TSaleHistory,
) => {
  const isExistUser = await User.findOne({ email: user.email });
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const isProductAvailable = await Book.findById({ _id: payload.product });
  if (!isProductAvailable) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!!');
  }

  if (isProductAvailable) {
    if (
      isProductAvailable.quantity < 0 ||
      isProductAvailable.quantity < payload.quantity
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Product Quanttiy is not available!!',
      );
    }
  }
  const data = {
    ...payload,
    sellerId: isExistUser._id,
  };
  const result = await SaleHistory.create(data);
  return result;
};

const getAllSaleHistoryFromDB = async () => {
  const result = await SaleHistory.find()
    .populate('seller')
    .populate('product');
  return result;
};

export const SaleHistoryServices = {
  getAllSaleHistoryFromDB,
  createSaleHistroyIntoDB,
};
