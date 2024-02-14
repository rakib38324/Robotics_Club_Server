/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './userRegistrstion.constant';

export type TUser = {
  name: string;
  email: string;
  role: 'User' | 'Manager';
  password: string;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hasPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
