import { Router } from 'express';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { loginRouters } from '../modeles/Auth/auth.router';

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
