import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { SaleHistoryServices } from './saleHistory.service';

const createSaleHistory = catchAsync(async (req, res) => {
  const result = await SaleHistoryServices.createSaleHistoryIntoDB(
    req.user,
    req.body,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sale Info. added successfully',
    data: result,
  });
});

const getAllSaleHistory = catchAsync(async (req, res) => {
  const result = await SaleHistoryServices.getAllSaleHistoryFromDB(
    req.user,
    req.query,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sale history find successfully',
    data: result,
  });
});
export const SaleHistoryControllers = {
  createSaleHistory,
  getAllSaleHistory,
};
