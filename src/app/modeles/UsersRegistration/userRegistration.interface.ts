/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './userRegistration.constant';

export type TUser = {
  role: 'User' | 'Admin';
  segment: 'Project Showcase' | 'LFR' | 'Soccer Boot' | 'Truss Challenge' | 'Robotic Club Admin';
  teamName: string;
  projectName?: string;
  projectDescription?: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamLeaderPhoneNumber: string;
  teamLeaderFacebookID?: string;
  teamMembers_1_name: string;
  teamMembers_1_email: string;
  teamMembers_1_phoneNumber: string;
  teamMembers_2_name: string;
  teamMembers_2_email: string;
  teamMembers_2_phoneNumber: string;
  transactionID: string;
  sandMoneyNumber: string;
  picture: string;
  password: string;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(teamLeaderEmail: string): Promise<TUser | null>;
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
