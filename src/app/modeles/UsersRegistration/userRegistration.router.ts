import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
const router = express.Router();

router.post(
  '/user-registration',
  ValidateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUsers,
);

export const userRouter = router;
