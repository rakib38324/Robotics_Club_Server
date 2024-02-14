import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utiles/catchAsync';
import AppError from '../errors/appError';
import config from '../config/config';
import { User } from '../modeles/UsersRegistration/userRegistration.model';

const Auth = () => {
  return catchAsync(
    async (req: Request, response: Response, next: NextFunction) => {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
      }

      // invalid token - synchronous
      //===> check the if the token valid

      let decoded;
      try {
        decoded = jwt.verify(
          token,
          config.jwt_access_secret as string,
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }

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

      req.user = decoded;

      next();
    },
  );
};

export default Auth;
