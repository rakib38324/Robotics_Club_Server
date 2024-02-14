import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { BookValidations } from './books.validation';
import { bookControllers } from './books.controller';
import Auth from '../../middlewares/Auth';
const router = express.Router();

router.get('/', Auth('Manager', 'User'), bookControllers.getAllBooks);
router.get('/:id', Auth('Manager', 'User'), bookControllers.getSingleBook);
router.delete('/:id', Auth('Manager', 'User'), bookControllers.deleteBook);
router.post(
  '/multiple-delete',
  Auth('Manager', 'User'),
  bookControllers.deleteMultipleBooks,
);

router.post(
  '/create-book',
  Auth('Manager', 'User'),
  ValidateRequest(BookValidations.createBookValidationSchema),
  bookControllers.createBooks,
);

router.put(
  '/update-book/:id',
  Auth('Manager', 'User'),
  ValidateRequest(BookValidations.updateBookValidationSchema),
  bookControllers.updateBooks,
);

export const bookRouters = router;
