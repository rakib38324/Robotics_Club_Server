import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TSaleHistory } from './saleHistory.interface';
import { SaleHistory } from './saleHistory.model';
import { JwtPayload } from 'jsonwebtoken';
import { Book } from '../Books/books.model';

const createSaleHistoryIntoDB = async (
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

const getAllSaleHistoryFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const isExistUser = await User.findOne({ email: user?.email });

  if ('yearly' in query) {
    const currentYear = new Date().getFullYear() + 1;
    const previousTenYear = currentYear - 10;
    const result = await SaleHistory.aggregate([
      {
        $match: {
          saleDate: {
            $gte: `${previousTenYear}`,
            $lte: `${currentYear}`,
          },
        },
      },
      {
        $group: {
          _id: { $year: { $toDate: '$saleDate' } },
          totalSales: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          year: '$_id',
          totalSales: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1 },
      },
    ]);

    return result;
  }

  if ('monthly' in query) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const result = await SaleHistory.aggregate([
      {
        $match: {
          saleDate: {
            $gte: `${currentYear}`,
            $lte: `${nextYear}`,
          },
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: '$saleDate' } },
          totalSales: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          month: '$_id',
          totalSales: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    return result;
  }

  if ('weekly' in query) {
    const today = new Date();
    const startOfPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    const endOfPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    );

    const formattedStartOfPreviousMonth = `${startOfPreviousMonth.getFullYear()}-${(
      startOfPreviousMonth.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-01`;

    // Define an array to store the weekly sales data
    const weeklySalesData = [];

    // Start date of the previous month
    const startDate = new Date(formattedStartOfPreviousMonth);

    // Initialize week counter
    let weekCounter = 1;

    // Loop until the end of the previous month
    while (startDate <= endOfPreviousMonth) {
      // End date of the current week
      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      if (endDate > endOfPreviousMonth) {
        endDate = new Date(endOfPreviousMonth);
      }

      const result = await SaleHistory.aggregate([
        {
          $match: {
            saleDate: {
              $gte: startDate.toISOString().split('T')[0],
              $lte: endDate.toISOString().split('T')[0],
            }, // Keep dates as strings for comparison
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$quantity' },
          },
        },
        {
          $project: {
            totalSales: 1,
            _id: 0,
          },
        },
      ]);

      // Push weekly sales data to the array
      weeklySalesData.push({
        totalSales: result.length ? result[0].totalSales : 0,
        week: weekCounter,
        date: `${startDate.toISOString().split('T')[0]} to ${
          endDate.toISOString().split('T')[0]
        }`,
      });

      // Move to the start of the next week
      startDate.setDate(startDate.getDate() + 7);
      weekCounter++;
    }

    return weeklySalesData;
  }

  // if ('daily' in query) {
  //   const today = new Date();

  //   const TodyFormattedDate = today.toISOString().split('T')[0];

  //   const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  //   const thirtyDayFormattedDate = thirtyDaysAgo.toISOString().split('T')[0];

  //   const result = await SaleHistory.aggregate([
  //     {
  //       $match: {
  //         saleDate: { $gte: thirtyDayFormattedDate, $lte: TodyFormattedDate },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$saleDate',
  //         totalSales: { $sum: '$quantity' },
  //       },
  //     },
  //     {
  //       $project: {
  //         date: '$_id',
  //         totalSales: 1,
  //         _id: 0,
  //       },
  //     },
  //     {
  //       $sort: { date: 1 },
  //     },
  //   ]);

  //   return result;
  // }

  if ('daily' in query) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const result = await SaleHistory.aggregate([
      {
        $match: {
          saleDate: { $gte: thirtyDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
          totalSales: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          date: '$_id',
          totalSales: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return result.map(({ date, totalSales }) => ({
      date,
      totalSale: totalSales,
    }));
  }

  const result =
    isExistUser?.role === 'User'
      ? await SaleHistory.find({ sellerId: isExistUser?._id })
          .populate('seller')
          .populate('product')
      : await SaleHistory.find().populate('seller').populate('product');

  return result;
};

export const SaleHistoryServices = {
  getAllSaleHistoryFromDB,
  createSaleHistoryIntoDB,
};
