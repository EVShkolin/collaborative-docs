import { type ReactNode, useMemo, useState } from 'react';
import { isTokenValid } from '@/util/tokenValidator.ts';
import { AuthContext } from './AuthContext';
import { tokenStore } from '@/api/tokenStore.ts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = tokenStore.getToken();
    if (storedToken && isTokenValid(storedToken)) {
      return storedToken;
    }
    return null;
  });

  const isAuthenticated = useMemo(() => isTokenValid(token), [token]);

  const login = (token: string) => {
    setToken(token);
    tokenStore.setToken(token);
  };

  const logout = () => {
    setToken(null);
    tokenStore.clearToken();
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};
