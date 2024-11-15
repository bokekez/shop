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
  //[x: string]: any;
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
  onSearch: (query: string) => void;
}
