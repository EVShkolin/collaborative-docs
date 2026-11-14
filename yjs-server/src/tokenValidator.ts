import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

interface TokenPayload {
  iat: number;
  exp: number;
  userId: number;
  documentId: string;
  username: string;
  role: 'viewer' | 'commenter' | 'editor';
}

let cachedPublicKey: string | undefined;

function loadPublicKey(): string {
  if (cachedPublicKey) return cachedPublicKey;

  const keyPath =
    process.env.JWT_PUBLIC_KEY ??
    path.join(process.cwd(), 'keys', 'jwt-public.pem');

  cachedPublicKey = fs.readFileSync(keyPath, 'utf8').trim();
  return cachedPublicKey;
}

export const getDataFromToken = (token: string): TokenPayload => {
  if (!token) throw new Error('Token must be defined');

  return jwt.verify(token, loadPublicKey(), {
    algorithms: ['RS256'],
  }) as TokenPayload;
};