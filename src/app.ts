import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import router from './app/routers';
import globalErrorHandeler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';

const app: Application = express();

//--->parser
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

//==========>application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Book Management Server is running successfully.');
});

//========> handle the router not found
app.use(notFound);

//--> global error
app.use(globalErrorHandeler);
export default app;
