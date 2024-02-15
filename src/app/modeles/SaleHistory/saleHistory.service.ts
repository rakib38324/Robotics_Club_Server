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
    const currentYear = new Date().getFullYear();
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

    // Generate an array of all years in the range
    const yearsInRange = [];
    for (let year = previousTenYear; year <= currentYear; year++) {
      yearsInRange.push(year);
    }

    // Left join with the sales data to include years with zero sales
    const finalResult = yearsInRange.map((year) => {
      const sale = result.find((entry) => entry.year === year);
      return sale ? sale : { year, totalSales: 0 };
    });

    return finalResult;
  }

  if ('monthly' in query) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const result = await SaleHistory.aggregate([
      {
        $match: {
          saleDate: {
            $gte: `${currentYear}`,
            $lt: `${nextYear}`, // Use $lt instead of $lte to exclude the next year
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

    // Generate an array of all months in the year
    const monthsInRange = [];
    for (let i = 0; i < 12; i++) {
      // Adjusted to start from 0

      monthsInRange.push({
        month: i,
        monthName: new Date(currentYear, i, 1).toLocaleString('default', {
          month: 'long',
        }),
        totalSales: 0,
      });
    }

    // Left join with the sales data to include months with zero sales
    const finalResult = monthsInRange.map((month) => {
      const sale = result.find((entry) => entry.month === month.month);
      return sale ? { ...sale, monthName: month.monthName } : month;
    });

    return finalResult;
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

  if ('daily' in query) {
    const today = new Date();

    const todayFormattedDate = today.toISOString().split('T')[0];

    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoFormattedDate = thirtyDaysAgo
      .toISOString()
      .split('T')[0];

    const result = await SaleHistory.aggregate([
      {
        $match: {
          saleDate: {
            $gte: thirtyDaysAgoFormattedDate,
            $lte: todayFormattedDate,
          },
        },
      },
      {
        $group: {
          _id: '$saleDate',
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

    // Now we'll generate an array of dates within the range
    const datesInRange = [];
    const currentDate = new Date(thirtyDaysAgo);
    while (currentDate <= today) {
      datesInRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Left join with the sales data to include dates with zero sales
    const finalResult = datesInRange.map((date) => {
      const sale = result.find((entry) => entry.date === date);
      return sale ? sale : { date, totalSales: 0 };
    });

    return finalResult;
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
