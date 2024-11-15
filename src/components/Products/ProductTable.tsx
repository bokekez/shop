import React from 'react';
import styles from './ProductTable.module.css';
import { ProductTableProps } from '../../types/ProductInterfaces';

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  currentPage,
  lastPage,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div>
      {loading && <p>Loading products...</p>}
      {!loading && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Price</th>
                <th>Description</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td data-label="Thumbnail">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className={styles.thumbnail}
                    />
                  </td>
                  <td data-label="Title">{product.title}</td>
                  <td data-label="Price">${product.price.toFixed(2)}</td>
                  <td data-label="Description">
                    {product.description.slice(0, 100)}...
                  </td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Rating">{product.rating}</td>
                  <td data-label="Stock">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {lastPage}
            </span>
            <button
              onClick={onNextPage}
              disabled={currentPage === lastPage}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTable;
