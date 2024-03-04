import httpStatus from 'http-status';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';
import { JwtPayload } from 'jsonwebtoken';

const createUserIntoDB = async (payload: TUser) => {
  const { teamLeaderEmail } = payload;
  const userExists = await User.findOne({ teamLeaderEmail });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists! Duplicate email.',
    );
  }

  const data = {
    ...payload,
    passwordChangedAt: new Date(),
  };

  const user = await User.create(data);

  if (user) {
    const result = await User.aggregate([
      {
        $match: { teamLeaderEmail: user?.teamLeaderEmail },
      },
      {
        $project: {
          password: 0,
          passwordChangedAt: 0,
          __v: 0,
        },
      },
    ]);
    return result[0];
  }
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (email: string) => {
  const studentExist = await User.isUserExistsByEmail(email);

  if (studentExist) {
    const result = await User.findOne({ teamLeaderEmail: email });

    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
};

const deleteUserFromDB = async (email: string) => {
  const studentExist = await User.isUserExistsByEmail(email);
  if (studentExist) {
    const deletedUser = await User.findOneAndDelete({
      teamLeaderEmail: email,
    });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }

    return deletedUser;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Exists!');
  }
};

const updateUserFromDB = async (
  email: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  if (payload.role) {
    if (user?.role === 'User') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'User Role Change only Admin.',
      );
    }
  }
  if (payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password is not Update-able field.',
    );
  }

  if (await User.isUserExistsByEmail(email)) {
    const result = await User.findOneAndUpdate(
      { teamLeaderEmail: email },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Exists!');
  }
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
};
