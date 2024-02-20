import { Router } from 'express';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { loginRouters } from '../modeles/Auth/auth.router';
import { userCrudRouter } from '../modeles/UsersRegistration/UserCRUDMethod';

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
    path: '/user',
    route: userCrudRouter,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
