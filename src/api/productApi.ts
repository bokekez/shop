import { ProductResponse, Product } from '../types/ProductModels';
import { sortQueryMap } from '../types/FilterModels';
import { checkAndRefreshToken } from './authApi';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchProducts = async (
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort];
  const url = `${BASE_URL}/products?limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;
  return sendRequest(url);
};

export const fetchProductsByCategoy = async (
  category: string,
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort];
  const url = `${BASE_URL}/products/category/${category}/?limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;
  return sendRequest(url);
};

export const searchProducts = async (
  query: string,
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort];
  const url = `${BASE_URL}/products/search?q=${query}&&limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;
  return sendRequest(url);
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const url = `${BASE_URL}/products/${id}`;
  return sendRequest(url);
};

const sendRequest = async (url: string) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) checkAndRefreshToken(token);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
