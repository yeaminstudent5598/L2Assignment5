import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
