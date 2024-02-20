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

const getAllUsers = catchAsync(async (req, res) => {
  // console.log(req.query)

  const result = await UserServices.getAllUsersFromDB();

  //===>sent response
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users Data Found Successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getSingleUserFromDB(email);

  //--->sent response
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Single Data Found Successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  await UserServices.deleteUserFromDB(email);

  //--> sent response
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: '',
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.updateUserFromDB(email, req.body);

  //--> sent response
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Updated successfully',
    data: result,
  });
});

export const userControllers = {
  createUsers,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
