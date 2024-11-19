import React, { useEffect, useState, useContext } from 'react';
import ProductTable from '../../components/Products/ProductTable';
import Filter from '../../components/Filter/Filter';
import styles from './Products.module.css';
import Search from '../../components/Search/Search';
import {
  showToastifyError,
  showToastifyWarning,
} from '../../config/toastifyConfig';
import {
  fetchProducts,
  fetchProductsByCategoy,
  searchProducts,
} from '../../api/productApi';
import { Product } from '../../types/ProductInterfaces';
import { Filters } from '../../types/FilterInterfaces';
import { CartItem } from '../../types/CartInterfaces';
import { CartContext } from '../../context/cartContext';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterChange, setFilterChange] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const PRODUCTS_PER_PAGE = 20;
  const PRODUCTS_SELECT = [
    'title',
    'price',
    'category',
    'rating',
    'stock',
    'description',
    'thumbnail',
  ].join();

  const { cartItems } = useContext(CartContext)!;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.products);
        setTotalProducts(response.total);
      } catch {
        showToastifyError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    const getProducts = async () => {
      const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
      if (searchQuery) {
        return await searchProducts(
          searchQuery,
          PRODUCTS_SELECT,
          PRODUCTS_PER_PAGE,
          skip,
          filters.sortBy
        );
      }
      if (filters.category) {
        const minPriceNormalized = filters.minPrice || 0;
        const maxPriceNormalized = filters.maxPrice || Infinity;

        const response = await fetchProductsByCategoy(
          filters.category,
          PRODUCTS_SELECT,
          PRODUCTS_PER_PAGE,
          skip,
          filters.sortBy
        );

        response.products = response.products.filter(
          (product) =>
            product &&
            product.price >= minPriceNormalized &&
            product.price <= maxPriceNormalized
        );

        return response;
      }
      return await fetchProducts(
        PRODUCTS_SELECT,
        PRODUCTS_PER_PAGE,
        skip,
        filters.sortBy
      );
    };

    loadProducts();
  }, [
    PRODUCTS_SELECT,
    PRODUCTS_PER_PAGE,
    currentPage,
    searchQuery,
    filterChange,
  ]);

  const lastPage = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleApplyFilters = (
    category: string | null,
    minPrice?: number | undefined,
    maxPrice?: number | undefined,
    sortBy?: string | undefined
  ) => {
    if (!category && (minPrice || maxPrice))
      showToastifyWarning('Categoy must be selected to apply min or max price');
    setFilters({ category, minPrice, maxPrice, sortBy });
    setFilterChange(filterChange ? false : true);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
 
  const productsWithStock = products.map((product) => {
    const cartQuantity = cartItems.find((item: CartItem) => item.id === product.id)?.quantity || 0;
    return {
      ...product,
      stock: product.stock - cartQuantity,
    };
  });

  return (
    <div className={styles.productsContainer}>
      <Search onSearch={handleSearch} />
      <div className={styles.tableContainer}>
        <Filter onApplyFilters={handleApplyFilters} />
        <ProductTable
          products={productsWithStock}
          loading={loading}
          currentPage={currentPage}
          lastPage={lastPage}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </div>
    </div>
  );
};

export default Products;
