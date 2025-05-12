import { url } from "../url";

export const getCsrfToken = async () => {
  const response = await fetch(`${url.current}/csrf-token`, {
    credentials: 'include',
  });
  const data = await response.json();
  return data.token;
};


export const register = async (email: string, password: string, name: string) => {
  const token = await getCsrfToken();
  const response = await fetch(`${url.current}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  });
  const data = await response.json();
  return data;
};

export const login = async (email: string, password: string) => {
  const token = await getCsrfToken();
  const response = await fetch(`${url.current}/login`, {
    method: 'POST',
    headers: {  
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};
