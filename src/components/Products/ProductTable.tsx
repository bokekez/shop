import React, { useContext } from 'react';
import styles from './ProductTable.module.css';
import { ProductTableProps } from '../../types/ProductInterfaces';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { CartContext } from '../../context/cartContext';
import { CartItem } from '../../types/CartInterfaces';
import { Product } from '../../types/ProductInterfaces';
import { showToastifyWarning } from '../../config/toastifyConfig';

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  currentPage,
  lastPage,
  onNextPage,
  onPreviousPage,
}) => {
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const handleAddToCart = (product: Product) => {
    if(product.stock <= 0) return showToastifyWarning('Not enough stock', 'noStock')
    const cartItem: CartItem = {
      ...product, 
      quantity: 1, 
    };
    cartContext?.addToCart(cartItem, 1);
  };

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
                {authContext?.user?.username && <th>Add to Cart</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td data-label="Thumbnail">
                    <Link
                      to={`/shop/product/${product.id}`}
                      className={styles.productLink}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className={styles.thumbnail}
                      />
                    </Link>
                  </td>
                  <td data-label="Title">
                    <Link
                      to={`/shop/product/${product.id}`}
                      className={styles.productLink}
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td data-label="Price">${product.price.toFixed(2)}</td>
                  <td data-label="Description">
                    {product.description.slice(0, 100)}...
                  </td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Rating">{product.rating}</td>
                  <td data-label="Stock">{product.stock}</td>
                  {authContext?.user?.username && (
                    <td data-label="Action">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={styles.addToCartButton}
                      >
                        Add to Cart
                      </button>
                    </td>
                  )}
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
