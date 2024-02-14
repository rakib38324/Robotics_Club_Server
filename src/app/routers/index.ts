import { Router } from 'express';
import { bookRouters } from '../modeles/Books/books.router';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { loginRouters } from '../modeles/Auth/auth.router';
import { saleHistoryRouter } from '../modeles/SaleHistory/saleHistory.router';

const router = Router();

const moduleRouters = [
  {
    path: '/register',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/books',
    route: bookRouters,
  },
  {
    path: '/sale',
    route: saleHistoryRouter,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
