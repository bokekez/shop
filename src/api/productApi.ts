import { ProductResponse, Product } from '../types/ProductInterfaces';
import { sortQueryInterface } from '../types/FilterInterfaces';

const BASE_URL='https://dummyjson.com/products'

const sortQueryMap: sortQueryInterface = {
  none: '',
  priceAsc: '&sortBy=price&order=asc',
  priceDesc: '&sortBy=price&order=desc',
  nameAsc: '&sortBy=title&order=asc',
  nameDesc: '&sortBy=title&order=desc',
}

export const fetchProducts = async  (
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort]
  const url = `${BASE_URL}?limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export const fetchProductsByCategoy = async  (
  category: string,
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort]
  const url = `${BASE_URL}/category/${category}/?limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export const searchProducts = async (
  query: string,
  select: string,
  limit = 20,
  skip = 0,
  sort = 'none'
): Promise<ProductResponse> => {
  const sortByQuery = sortQueryMap[sort]
  const url = `${BASE_URL}/search?q=${query}&&limit=${limit}&skip=${skip}&select=${select}${sortByQuery}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const fetchProductById = async (id: number): Promise<Product> => {
  const url = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
