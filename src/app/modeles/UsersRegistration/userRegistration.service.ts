import httpStatus from 'http-status';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';

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

export const UserServices = {
  createUserIntoDB,
};
