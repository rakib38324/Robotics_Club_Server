/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TBooks } from './books.interface';
import { Book } from './books.model';
import { User } from '../UsersRegistration/userRegistration.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const createBookIntoDB = async (user: JwtPayload, payload: TBooks) => {
  const { ISBN, Language, bookFormate } = payload;

  //=========> check user exist
  const isUserExist = await User.findOne({ email: user.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const existingBook = await Book.aggregate([
    {
      $match: {
        $and: [
          { user: isUserExist._id },
          { Language: Language },
          { bookFormate: bookFormate },
          { ISBN: ISBN },
        ],
      },
    },
  ]);

  if (existingBook.length > 0) {
    // If it exists, update the quantity
    const bookToUpdate = existingBook[0];
    bookToUpdate.quantity += payload.quantity;
    await Book.findByIdAndUpdate(bookToUpdate._id, { $set: bookToUpdate });
    return bookToUpdate;
  }
  const data = {
    ...payload,
    user: isUserExist._id,
  };

  const result = await Book.create(data);
  return result;
};

const getAllBooksFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const queryObj = { ...query };

  const isExistUser = await User.isUserExistsByEmail(user?.email);

  const { _id }: any = isExistUser;
  if (isExistUser && _id) {
    const allData =
      isExistUser?.role === 'User' ? Book.find({ user: _id }) : Book.find();

    // Filtering
    const excludeFields = [
      'Price',
      'Language',
      'ReleaseDate',
      'Author',
      'ISBN',
      'startDate',
      'Genre',
      'Publisher',
      'Series',
      'Language',
      'bookFormate',
      'limit',
      'page',
    ];

    excludeFields.forEach((el) => delete queryObj[el]);

    //===========================================> sorting and filtering <===========================================>

    const filterQuery = allData.find(queryObj);

    //==================================================> min max query <===============================================
    const Price = query.Price ? parseFloat(query.Price as string) : undefined;

    const filter: any = {};

    if (Price !== undefined) {
      filter.Price = { $eq: Price };
    }

    const MinMaxQuery = filterQuery.find({ ...filter });

    //=======================================> date filtering <====================================
    const DateFilter: any = {};

    const Date = query.ReleaseDate;

    if (Date !== undefined) {
      DateFilter.ReleaseDate = { $eq: Date };
    }

    const DateFiltering = MinMaxQuery.find({ ...DateFilter });

    //===================================> filter with language <===============================
    const language: any = query.Language;

    let languageFilter: any = {};

    if (language !== undefined) {
      languageFilter = { Language: language };
    }

    const languageQuery = DateFiltering.find({ ...languageFilter });

    //===================================> filter with Author <===============================
    const author: any = query.Author;
    let authorFilter: any = {};
    if (author !== undefined) {
      authorFilter = { Author: author };
    }

    const authorQuery = languageQuery.find({ ...authorFilter });

    //===================================> filter with ISBn <===============================
    const isbn: any = query.ISBN;
    let isbnFilter: any = {};
    if (isbn !== undefined) {
      isbnFilter = { ISBN: isbn };
    }

    const isbnQuery = authorQuery.find({ ...isbnFilter });

    //===================================> filter with publisher <===============================
    const publisher: any = query.Publisher;
    let publisherFilter: any = {};
    if (publisher !== undefined) {
      publisherFilter = { Publisher: publisher };
    }

    const publisherQuery = isbnQuery.find({ ...publisherFilter });

    //===================================> filter with Book Formate <===============================
    const bookFormate: any = query.bookFormate;
    let bookFormateFilter: any = {};
    if (bookFormate !== undefined) {
      bookFormateFilter = { bookFormate: bookFormate };
    }

    const bookFormateQuery = publisherQuery.find({ ...bookFormateFilter });

    //===================================> filter with genre <===============================
    const genre: any = query.Genre;
    let genreFilter: any = {};
    if (genre !== undefined) {
      genreFilter = { Geren: genre };
    }

    const GerenQuery = bookFormateQuery.find({ ...genreFilter });

    //===================================> filter with series <===============================
    const series: any = query.Genre;
    let seriesFilter: any = {};
    if (series !== undefined) {
      seriesFilter = { Series: series };
    }

    const seriesQuery = GerenQuery.find({ ...seriesFilter });

    const totalData =
      isExistUser?.role === 'User'
        ? await Book.find({ user: _id })
        : await Book.find();
    //<============================================> pagination <===========================================>
    let page = 1;
    let limit = 10;
    let skip = 0;

    if (query.limit) {
      limit = Number(query.limit);
    }

    if (query.page) {
      page = Number(query.page);
      skip = (page - 1) * limit;
    }

    const paginateQuery = seriesQuery.skip(skip);
    const limitQuery = await paginateQuery.limit(limit).populate('user');
    return { limitQuery, page, limit, totalData };
  }
};

const updateBookFromDB = async (
  user: JwtPayload,
  payload: TBooks,
  bookId: string,
) => {
  //=========> check user exist
  const isUserExist = await User.findOne({ email: user.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isProductExist = await Book.findById(bookId);

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Books information is not found');
  }

  const result = await Book.findByIdAndUpdate(isProductExist._id, payload, {
    new: true,
  });

  return result;
};

const getSingleBookFromDB = async (user: JwtPayload, _id: string) => {
  const isExistUser = await User.isUserExistsByEmail(user?.email);

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!');
  }

  const isBookExist = await Book.findById({ _id });

  if (!isBookExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book is not found!!');
  }

  return isBookExist;
};

const deleteSingleBookFromDB = async (user: JwtPayload, _id: string) => {
  const isExistUser = await User.isUserExistsByEmail(user?.email);

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!');
  }

  const isExistBook = await Book.findById({ _id });

  if (!isExistBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found!!');
  }

  const deleteBook = await Book.findByIdAndDelete({ _id });

  if (!deleteBook) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Book!!');
  }

  return deleteBook;
};

const deleteMultipleBooksFromDB = async (
  user: JwtPayload,
  bookIds: string[],
) => {
  const isExistUser = await User.isUserExistsByEmail(user?.email);

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!');
  }

  // Validate if all books exist
  const existingBooks = await Book.find({ _id: { $in: bookIds } });
  const missingBooks = bookIds.filter(
    (bookId) => !existingBooks.some((book) => book._id.equals(bookId)),
  );

  if (missingBooks.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Books not found: ${missingBooks.join(', ')}`,
    );
  }

  const deleteResult = await Book.deleteMany({ _id: { $in: bookIds } });

  if (deleteResult.deletedCount !== bookIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete one or more books!!',
    );
  }

  return { deletedCount: deleteResult.deletedCount };
};

export const BooksServices = {
  createBookIntoDB,
  getAllBooksFromDB,
  updateBookFromDB,
  getSingleBookFromDB,
  deleteSingleBookFromDB,
  deleteMultipleBooksFromDB,
};
