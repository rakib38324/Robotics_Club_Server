import express from 'express';
import Auth from '../../middlewares/Auth';
import { userControllers } from './userRegistration.controller';
import { UserValidations } from './userRegistration.validation';
import ValidateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', Auth('Admin', 'User'), userControllers.getAllUsers);

router.get('/:email', Auth('Admin', 'User'), userControllers.getSingleUser);

router.delete('/delete/:email', Auth('Admin'), userControllers.deleteUser);

router.patch(
  '/update-user/:email',
  Auth('Admin', 'User'),
  ValidateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

export const userCrudRouter = router;
