import { Response } from 'express';

type Tresponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const commonRes = <T>(res: Response, data: Tresponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default commonRes;
