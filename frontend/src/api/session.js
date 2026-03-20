const STORAGE_KEY = 'clinic_session';

export const getSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getToken = () => getSession()?.token;

export const getUser = () => getSession()?.user;

export const isAuthenticated = () => Boolean(getToken());
