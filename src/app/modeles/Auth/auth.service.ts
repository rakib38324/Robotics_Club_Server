import httpStatus from 'http-status';
import { TLoginUser } from './auth.interface';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TJwtPayload, VerifyToken, createToken } from './auth.utillis';
import config from '../../config/config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utiles/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  ///====> checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TJwtPayload = {
    email: isUserExists?.email,
    name: isUserExists?.name,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiress_in as string,
  );

  //===========> create refresh token and sent to the client
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiress_in as string,
  );

  return { user: jwtPayload, token: accessToken, refreshToken: refreshToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  //===>check if the user is exists
  const isUserExists = await User.isUserExistsByEmail(userData.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const currentPassword = payload?.currentPassword;
  const hashpassword = isUserExists?.password;

  ///====> checking if the given password and exists password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    currentPassword,
    hashpassword,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!');
  }

  // invalid token - synchronous
  //===> check the if the token valid

  const decoded = VerifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByEmail(email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  if (
    isUserExists.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      isUserExists.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload = {
    email: isUserExists?.email,
    name: isUserExists?.name,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiress_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const isUserExists = await User.isUserExistsByEmail(email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const jwtPayload = {
    email: isUserExists?.email,
    name: isUserExists?.name,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;

  sendEmail(isUserExists.email, resetUILink);

  return `Reset link sent your email: ${isUserExists.email}`;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, `You are forbidden!!`);
  }

  ///===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return 'Your Password Changed Successfully';
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
