import React, { useEffect, useState, useContext } from 'react';
import ProductTable from '../../components/Products/ProductTable';
import Filter from '../../components/Filter/Filter';
import styles from './Products.module.css';
import Search from '../../components/Search/Search';
import { showToastifyError } from '../../config/toastifyConfig';
import { fetchProducts, fetchProductsByCategoy, searchProducts } from '../../api/productApi';
import { Product } from '../../types/ProductInterfaces';
import { Filters } from '../../types/FilterInterfaces';
import { CartItem } from '../../types/CartInterfaces';
import { CartContext } from '../../context/cartContext';
import { PRODUCTS_PER_PAGE, PRODUCTS_SELECT } from '../../constants/productConsts';
import { AuthContext } from '../../context/authContext';
import { refreshToken } from '../../api/authApi';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [filterChange, setFilterChange] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [seaching, setSeaching] = useState<boolean>(false);

  const { cartItems } = useContext(CartContext)!;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.products);
        setTotalProducts(response.total);
        if(authContext?.user?.id){
          const token = localStorage.getItem('authToken');
          if(token) refreshToken(token)
        }
      } catch {
        showToastifyError('Failed to fetch products.');
      } finally {
        setLoading(false);
        setSeaching(false);
      }
    };

    loadProducts();
  }, [PRODUCTS_SELECT, PRODUCTS_PER_PAGE, currentPage, seaching, filterChange]);

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
          product && product.price >= minPriceNormalized && product.price <= maxPriceNormalized
      );

      return response;
    }
    return await fetchProducts(PRODUCTS_SELECT, PRODUCTS_PER_PAGE, skip, filters.sortBy);
  };


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
    setFilters({ category, minPrice, maxPrice, sortBy });
    setFilterChange(filterChange ? false : true);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSeaching(true);
    setCurrentPage(1);
  };

  const searchString = (query: string) => {
    setSearchQuery(query);
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
      <Search onSearch={handleSearch} searchString={searchString} />
      <div className={styles.tableContainer}>
        <Filter onApplyFilters={handleApplyFilters} searchQuery={searchQuery} />
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
