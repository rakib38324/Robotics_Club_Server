import { Types } from 'mongoose';

export type TCategory =
  | 'Fiction'
  | 'Mystery'
  | 'Science Fiction'
  | 'Romance'
  | 'Biography'
  | 'Self-help'
  | 'History'
  | 'Thriller'
  | 'Fantasy'
  | 'Non-fiction';

export type TBooks = {
  name: string;
  user: Types.ObjectId;
  image: string;
  quantity: number;
  Price: number;
  ReleaseDate: string;
  Author: string;
  ISBN: string;
  Genre: TCategory;
  Publisher: string;
  Series: string;
  Language: string;
  bookFormate: 'E-book' | 'Hard Copy' | 'Audio-Book';
};
