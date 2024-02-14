import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { BookValidations } from './books.validation';
import { bookControllers } from './books.controller';
import Auth from '../../middlewares/Auth';
const router = express.Router();

router.get('/', Auth(), bookControllers.getAllBooks);
router.get('/:id', Auth(), bookControllers.getSingleBook);
router.delete('/:id', Auth(), bookControllers.deleteBook);
router.post('/multiple-delete', Auth(), bookControllers.deleteMultipleBooks);

router.post(
  '/create-book',
  Auth(),
  ValidateRequest(BookValidations.createBookValidationSchema),
  bookControllers.createBooks,
);

router.put(
  '/update-book/:id',
  Auth(),
  ValidateRequest(BookValidations.updateBookValidationSchema),
  bookControllers.updateBooks,
);

export const bookRouters = router;
