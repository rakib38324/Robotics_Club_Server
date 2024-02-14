import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controller';
import Auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
  '/login',
  ValidateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  Auth(),
  ValidateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  ValidateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/forget-password',
  ValidateRequest(authValidations.forgetPasswprdValidationSchema),
  authControllers.forgetPassword,
);

router.post(
  '/reset-password',
  ValidateRequest(authValidations.resetPasswprdValidationSchema),
  authControllers.resetPassword,
);

export const loginRouters = router;
