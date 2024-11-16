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
}

export interface Filters {
  category: string | null;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface sortQueryInterface {
  none: string,
  priceAsc: string,
  priceDesc: string,
  nameAsc: string,
  nameDesc: string,
}
