const TOKEN_KEY = 'access_token';

let memoryToken: string | null = localStorage.getItem(TOKEN_KEY);

export const tokenStore = {
  getToken: (): string | null => memoryToken,

  setToken: (token: string) => {
    memoryToken = token;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: () => {
    memoryToken = null;
    localStorage.removeItem(TOKEN_KEY);
  },
};
