import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/cartContext';
import styles from './CartView.module.css';
import { CartItem } from '../../types/CartInterfaces';
import { showToastifySuccess } from '../../config/toastifyConfig';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotals } = useContext(CartContext);
  const [removeQuantities, setRemoveQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const handleInputChange = (id: number, value: string) => {
    const parsedValue = parseInt(value, 10);
    setRemoveQuantities((prev) => ({
      ...prev,
      [id]: parsedValue > 0 ? parsedValue : 1, // Ensure positive number.
    }));
  };

  const handleRemove = (id: number) => {
    const quantityToRemove = removeQuantities[id] || 1;
    removeFromCart(id, quantityToRemove);
    showToastifySuccess('Items removed')
  };

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
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                  <div className={styles.removeSection}>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={removeQuantities[item.id] || item.quantity}
                        onChange={(e) =>
                          handleInputChange(item.id, e.target.value)
                        }
                        className={styles.quantityInput}
                      />
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemove(item.id)}
                      >
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
        </>
      )}
    </div>
  );
};

export default Cart;
