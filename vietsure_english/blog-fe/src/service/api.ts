import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const isServer = typeof window === 'undefined';
const BASE_URL = isServer
  ? (process.env.NEXT_PUBLIC_BE_HOST_SERVER || process.env.NEXT_PUBLIC_BE_HOST)
  : process.env.NEXT_PUBLIC_BE_HOST;
const BE_TOKEN_ADMIN = process.env.NEXT_PUBLIC_BE_TOKEN_ADMIN;

// Centralized response checker: If HTTP Status 401, clear jwt cookie & redirect to '/' safely
const checkResponse = async (response: Response, endpoint: string) => {
  if (response.status === 401) {
    if (typeof window === 'undefined') {
      try {
        const cookieStore = cookies();
        (await cookieStore).delete('jwt');
      } catch (e) {}
      redirect('/');
    } else {
      try {
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user-login-store');
      } catch (e) {}
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      return;
    }
  }

  if (!response.ok) {
    throw new Error(`Failed request to ${endpoint} (${response.status})`);
  }

  return response.json();
};

// GET
export const getData = async (endpoint: string, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return checkResponse(response, endpoint);
};

// POST
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postData = async (endpoint: string, data: any, token = BE_TOKEN_ADMIN) => {
  let authToken = token;
  if (data && typeof data === 'object' && data.token && token === BE_TOKEN_ADMIN) {
    authToken = data.token;
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  return checkResponse(response, endpoint);
};

// PUT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putData = async (endpoint: string, data: any, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return checkResponse(response, endpoint);
};

// DELETE
export const deleteData = async (endpoint: string, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return checkResponse(response, endpoint);
};
