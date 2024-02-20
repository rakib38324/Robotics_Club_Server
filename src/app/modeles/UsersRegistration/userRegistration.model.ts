/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './userRegistration.interface';
import config from '../../config/config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    role: { type: String, required: true, enum: ['User', 'Admin'] },
    segment: {
      type: String,
      required: true,
      enum: ['Project Showcase', 'LFR', 'Soccer Boot', 'Robotic Club Admin'],
    },
    teamName: { type: String, required: true },
    projectName: { type: String },
    projectDescription: { type: String },
    teamLeaderName: { type: String, required: true },
    teamLeaderEmail: { type: String, required: true, unique: true },
    teamLeaderPhoneNumber: { type: String, required: true },
    teamLeaderFacebookID: { type: String },
    teamMembers_1_name: { type: String, required: true },
    teamMembers_1_email: { type: String, required: true },
    teamMembers_1_phoneNumber: { type: String, required: true },
    teamMembers_2_name: { type: String, required: true },
    teamMembers_2_email: { type: String, required: true },
    teamMembers_2_phoneNumber: { type: String, required: true },
    transactionID: { type: String, required: true },
    sandMoneyNumber: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  //==========> Hash the current password if it exists
  if (user.password && typeof user.password === 'string') {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round),
    );
  }

  next();
});

userSchema.statics.isUserExistsByEmail = async function (
  teamLeaderEmail: string,
) {
  return await User.findOne({ teamLeaderEmail });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hasPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hasPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
