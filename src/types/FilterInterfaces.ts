export interface Categories {
  name: string;
}

export interface FilterProps {
  onApplyFilters: (
    category: string | null,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
    order?: string
  ) => void;
  searchQuery: string;
}

export interface Filters {
  category: string | null;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface sortQueryInterface {
 [key: string]: string;
  none: string;
  priceAsc: string;
  priceDesc: string;
  nameAsc: string;
  nameDesc: string;
}

export const sortQueryMap: sortQueryInterface = {
  none: '',
  priceAsc: '&sortBy=price&order=asc',
  priceDesc: '&sortBy=price&order=desc',
  nameAsc: '&sortBy=title&order=asc',
  nameDesc: '&sortBy=title&order=desc',
};
