import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/cartContext';
import styles from './CartView.module.css';
import { CartItem } from '../../types/CartModels';
import { showToastifySuccess, showToastifyWarning } from '../../config/toastifyConfig';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotals, clearCart } = useContext(CartContext)!;
  const authContext = useContext(AuthContext);
  const [removeQuantities, setRemoveQuantities] = useState<{ [key: number]: number }>(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const handleInputChange = (id: number, value: string) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1) return showToastifyWarning('Must remove at least one item', 'removeMin');
    setRemoveQuantities((prev) => ({
      ...prev,
      [id]: parsedValue > 0 ? parsedValue : 1,
    }));
  };

  const handleRemove = (id: number) => {
    const quantityToRemove = removeQuantities[id];
    removeFromCart(id, quantityToRemove);
    showToastifySuccess('Items removed');
  };

  const handleBuyAll = () => {
    clearCart();
    showToastifySuccess('All items bought successfully!');
  };

  const handleRemoveAll = () => {
    clearCart();
    showToastifySuccess('All items removed from the cart.');
  };

  if (!authContext?.user?.username) {
    return <h2 className={styles.notLogedInInfo}>Log in to view your cart</h2>;
  }

  return (
    <div className={styles.cartContainer}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item: CartItem) => (
                <tr key={item.id}>
                  <td data-label="Thumbnail">
                    <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                  </td>
                  <td data-label="Product">
                    <Link to={`/product/${item.id}`} className={styles.cartLink}>
                      {item.title}
                    </Link>
                  </td>
                  <td data-label="Price">${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td data-label="Quantity">${(item.price * item.quantity).toFixed(2)}</td>
                  <td data-label="Actions">
                    <div className={styles.removeSection}>
                      <input
                        type="number"
                        max={item.quantity}
                        value={removeQuantities[item.id] || item.quantity}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        className={styles.quantityInput}
                      />
                      <button className={styles.removeButton} onClick={() => handleRemove(item.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.cartSummary}>
            <h3>Total Price: ${cartTotals.totalPrice.toFixed(2)}</h3>
          </div>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.cartActionButton} ${styles.buyAllButton}`}
              onClick={handleBuyAll}
            >
              Buy All
            </button>
            <button
              className={`${styles.cartActionButton} ${styles.removeAllButton}`}
              onClick={handleRemoveAll}
            >
              Remove All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
