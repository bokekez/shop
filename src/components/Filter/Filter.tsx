import React, { useEffect, useState } from 'react';
import styles from './Filter.module.css';
import { fetchCategories } from '../../api/categoriesApi';
import { Categories, FilterProps } from '../../types/FilterInterfaces';
import { showToastifyError, showToastifyWarning } from '../../config/toastifyConfig';

const Filter: React.FC<FilterProps> = ({ onApplyFilters, searchQuery }) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>();
  const [smallScreen, setSmallScreen] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

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

  useEffect(() => {
    if(window.innerWidth <= 500 && window.innerHeight <= 900)
      setSmallScreen(true)
  }, []);

  const handleCategoryChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
    console.log(searchQuery)
    if(searchQuery) return showToastifyWarning('Can not filter by categories while searching', 'categoryFilter')
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
    if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
      return showToastifyWarning('Min and max price must be numbers', 'number');
    }
    if (!selectedCategory && (minPrice || maxPrice)) {
      return showToastifyWarning('Categoy must be selected to apply min or max price', 'selectCategory');
    }
    if ((minPrice && maxPrice) && minPrice > maxPrice) {
      return showToastifyWarning('Max price must be greater then min price', 'selectCategory');
    }
    onApplyFilters(selectedCategory, minPrice, maxPrice, sortBy);
    setOpenFilter(false)
  };

  const handleOpenFilter = () => {
    setOpenFilter(openFilter ? false : true)
  }

  return (
    <div>
    {smallScreen && <button onClick={handleOpenFilter} className={styles.openButton}>{openFilter ? 'Close filter' : 'Open filter'}</button>}
    {(!smallScreen || (smallScreen && openFilter)) && <div className={`${styles.filterContainer} ${smallScreen ? styles.filterContainerSmall : ''}`}>
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

      {selectedCategory ? <div className={styles.filterGroup}>
        <label>Price Range For Categories:</label>
        <div className={styles.priceInputs}>
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min"
            min={0}
            className={styles.priceInput}
            disabled={!selectedCategory}
          />
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
            min={0}
            className={styles.priceInput}
            disabled={!selectedCategory}
          />
        </div>
        </div> :
        <label className={styles.filterInfo}>Select category to enable price filters</label>
      }

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
    </div> }
    </div>
  );
};

export default Filter;
