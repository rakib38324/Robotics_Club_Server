import express from 'express';
import Auth from '../../middlewares/Auth';
import ValidateRequest from '../../middlewares/validateRequest';
import { SaleHistoryControllers } from './saleHistory.controller';
import { saleHistoryValidations } from './saleHistory.validation';
const router = express.Router();

router.get(
  '/history',
  Auth('Manager', 'User'),
  SaleHistoryControllers.getAllSaleHistory,
);

router.post(
  '/create-sale-history',
  Auth('Manager', 'User'),
  ValidateRequest(saleHistoryValidations.createSaleHistoryValidationSchema),
  SaleHistoryControllers.createSaleHistory,
);

export const saleHistoryRouter = router;
