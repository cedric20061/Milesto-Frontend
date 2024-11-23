import Cookies from 'js-cookie';
import { authSuccess, logout as logoutAction } from '@/features/auth/authSlice.ts';
import { AppDispatch } from '@/app/store';
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/api/authApi';

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await loginApi(email, password);
    Cookies.set('token', data.token, { expires: 7 });
    dispatch(authSuccess(data.user));
  } catch (error) {
    console.error('Login error:', error);
  }
};

export const registerUser = (email: string, password: string, name:  string) => async (dispatch: AppDispatch) => {
  try {
    const data = await registerApi(email, password, name);
    Cookies.set('token', data.token, { expires: 7 });
    dispatch(authSuccess(data.user));
  } catch (error) {
    console.error('Register error:', error);
  }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  await logoutApi();
  Cookies.remove('token');
  dispatch(logoutAction());
};
