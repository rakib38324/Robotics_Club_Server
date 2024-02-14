import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { UserServices } from './userRegistration.service';

const createUsers = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration completed successfully',
    data: result,
  });
});

export const userControllers = {
  createUsers,
};
