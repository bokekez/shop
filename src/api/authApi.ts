import { UserResponse } from '../types/UserModels';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (username: string, password: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
      credentials: 'omit',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const checkUserToken = async (token: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'omit',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const refreshToken = async (token: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: `${token}`,
        expiresInMins: 30,
      }),
      credentials: 'omit',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const checkAndRefreshToken = async (token: string): Promise<void> => {
  const checkResp = await checkUserToken(token);
  if (checkResp.message) return;
  refreshToken(token);
};
