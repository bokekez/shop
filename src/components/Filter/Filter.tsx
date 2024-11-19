import React, { useEffect, useState } from 'react';
import styles from './Filter.module.css';
import { fetchCategories } from '../../api/categoriesApi';
import { Categories, FilterProps } from '../../types/FilterInterfaces';
import { showToastifyError, showToastifyWarning } from '../../config/toastifyConfig';

const Filter: React.FC<FilterProps> = ({ onApplyFilters }) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch {
        showToastifyError('Failed to fetch categories.');
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value || null;
    setSelectedCategory(category);
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(Number(event.target.value) === 0) return setMinPrice(undefined)
    setMinPrice(Number(event.target.value));
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(Number(event.target.value) === 0) return setMaxPrice(undefined)
    setMaxPrice(Number(event.target.value));
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleSubmit = () => {
    // if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
    //   return showToastifyWarning('Min and max price must be numbers', 'number');
    // }
    if (!selectedCategory && (minPrice || maxPrice)) {
      return showToastifyWarning('Categoy must be selected to apply min or max price', 'selectCategory');
    }
    onApplyFilters(selectedCategory, minPrice, maxPrice, sortBy);
  };

  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.filterTitle}>Filters</h3>
      <div className={styles.filterGroup}>
        <label>Category</label>
        <select
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          className={styles.select}
        >
          <option value="">All</option>
          {categories.map((category, i) => (
            <option key={i} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Price Range</label>
        <div className={styles.priceInputs}>
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min"
            min={0}
            className={styles.priceInput}
          />
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
            min={0}
            className={styles.priceInput}
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label>Sort By</label>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className={styles.select}
        >
          <option value="none">None</option>
          <option value="priceAsc">Price Ascending</option>
          <option value="priceDesc">Price Descending</option>
          <option value="nameAsc">Name Ascending</option>
          <option value="nameDesc">Name Descending</option>
        </select>
      </div>

      <button className={styles.applyButton} onClick={handleSubmit}>
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
