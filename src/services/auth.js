import moment from 'moment'

export const TOKEN_KEY = '@minha-carteira:token';
export const tokenExpires = '@wallet-token-expires'

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(tokenExpires, moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss'))
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};


