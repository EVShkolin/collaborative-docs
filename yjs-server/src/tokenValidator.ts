import jwt from 'jsonwebtoken';

interface TokenPayload {
  iat: number;
  exp: number;
  userId: number;
  documentId: string;
  username: string;
  role: 'viewer' | 'commenter' | 'editor';
}

export const getDataFromToken = (token: string): TokenPayload => {
  let publicKey = process.env.JWT_PUBLIC_KEY;
  if (!publicKey) throw new Error('Public key is not defined');
  if (!token) throw new Error('Token must be defined');

  publicKey = publicKey.replace(/\\n/g, '\n');

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as TokenPayload;
};
