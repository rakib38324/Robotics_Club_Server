import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { BooksServices } from './books.service';

const createBooks = catchAsync(async (req, res) => {
  const result = await BooksServices.createBookIntoDB(req.user, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books created successfully',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req, res) => {
  const result = await BooksServices.getAllBooksFromDB(req.user, req.query);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books Find successfully',
    data: result,
  });
});

const getSingleBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BooksServices.getSingleBookFromDB(req.user, id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Find successfully',
    data: result,
  });
});

const updateBooks = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BooksServices.updateBookFromDB(req.user, req.body, id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books updated successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BooksServices.deleteSingleBookFromDB(req.user, id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: result,
  });
});

const deleteMultipleBooks = catchAsync(async (req, res) => {
  const { booksId } = req.body;

  const result = await BooksServices.deleteMultipleBooksFromDB(
    req.user,
    booksId,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books are deleted successfully',
    data: result,
  });
});

export const bookControllers = {
  createBooks,
  getAllBooks,
  updateBooks,
  getSingleBook,
  deleteBook,
  deleteMultipleBooks,
};
