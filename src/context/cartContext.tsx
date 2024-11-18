import { createContext, useState, ReactNode, FC } from 'react';
import { CartItem, CartContextType } from '../types/CartInterfaces';

const defaultCartContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartTotals: {
    totalItems: 0,
    totalPrice: 0,
  },
};

const CartContext = createContext<CartContextType | undefined>(defaultCartContext);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem, addingQuantity: number = 1) => {
    setCartItems((existingItems) => {
      const itemExists = existingItems.find((cartItem) => cartItem.id === item.id);
      if (itemExists) {
        return existingItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + addingQuantity }
            : cartItem
        );
      } else {
        return [...existingItems, { ...item, quantity: addingQuantity }];
      }
    });
  };

  const removeFromCart = (id: number, quantityToRemove: number) => {
    setCartItems((existingItems) => {
      return existingItems
        .map((item) => {
          if (item.id === id) {
            const remainingQuantity = item.quantity - quantityToRemove;
            return remainingQuantity > 0
              ? { ...item, quantity: remainingQuantity }
              : null; 
          }
          return item;
        })
        .filter(Boolean); 
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateCartSummary = (cartItems: CartItem[]) => {
    return cartItems.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 } 
    );
  };

  const cartTotals = calculateCartSummary(cartItems);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotals}}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
