// src/utils/sendResponse.ts

import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: any;  // Optional meta property to include pagination or extra info
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responsePayload: any = {
    success: data.success,
    message: data.message,
    data: data.data ?? null,
  };

  if (data.meta !== undefined) {
    responsePayload.meta = data.meta;
  }

  res.status(data.statusCode).json(responsePayload);
};

export default sendResponse;
