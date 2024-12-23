import { Categories } from '../types/FilterModels';
import { BASE_URL } from '../constants/envConsts';

export const fetchCategories = async (): Promise<Categories[]> => {
  const url = `${BASE_URL}/products/categories`;
  try {
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
