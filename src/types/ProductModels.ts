export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  thumbnail: string;
  description: string;
  total: number;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
}

export interface ProductTableProps {
  products: Product[];
  loading: boolean;
  currentPage: number;
  lastPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export interface SearchProps {
  onSearch: (search: boolean) => void;
  searchString: (query: string) => void;
}

export interface ProductDetailsInterface {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  stock: number;
  images: string[];
  brand?: string;
  discountPercentage?: number;
  thumbnail?: string;
}
