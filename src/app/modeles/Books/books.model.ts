import { Schema, model } from 'mongoose';
import { TBooks } from './books.interface';

const Book_Schema = new Schema<TBooks>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
    },
    image: {
      type: String,
      required: [true, 'Image is required.'],
    },
    name: {
      type: String,
      required: [true, 'Book name is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
    },
    Price: {
      type: Number,
      required: [true, 'Price is required.'],
    },
    ReleaseDate: {
      type: String,
      required: [true, 'Relase Date is required.'],
    },
    Author: {
      type: String,
      required: [true, 'Writer name is required.'],
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required.'],
    },
    Genre: {
      type: String,
      enum: [
        'Fiction',
        'Mystery',
        'Science Fiction',
        'Romance',
        'Biography',
        'Self-help',
        'History',
        'Thriller',
        'Fantasy',
        'Non-fiction',
      ],
      required: [true, 'Category is required.'],
    },
    Publisher: {
      type: String,
      required: [true, 'Publisher is required.'],
    },
    Series: {
      type: String,
      required: [true, 'Series is required.'],
    },
    Language: {
      type: String,
      required: [true, 'Language is required.'],
    },
    bookFormate: {
      type: String,
      enum: ['E-Book', 'Hard Copy', 'Audio-Book'],
    },
  },
  {
    timestamps: true,
  },
);

export const Book = model<TBooks>('Book', Book_Schema);
