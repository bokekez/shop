import { Categories } from "../types/FilterInterfaces";

export const fetchCategories = async (): Promise<Categories[]> => {
  const url = 'https://dummyjson.com/products/categories';
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
