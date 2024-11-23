// src/utils/cookies.ts
import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  Cookies.set('authToken', token, { expires: 7 });
};

export const getAuthToken = () => Cookies.get('authToken');

export const removeAuthToken = () => Cookies.remove('authToken');
