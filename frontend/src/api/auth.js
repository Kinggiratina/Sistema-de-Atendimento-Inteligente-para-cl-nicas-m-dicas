import api from './client';
import { setSession, clearSession, getUser, isAuthenticated } from './session';

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  setSession(data);
  return data.user;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  setSession(data);
  return data.user;
};

export const logout = () => {
  clearSession();
  window.location.href = '/login';
};

export const currentUser = () => getUser();
export { isAuthenticated };
