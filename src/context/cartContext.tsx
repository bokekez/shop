import { createContext, useState, ReactNode, FC, useEffect, useContext } from 'react';
import { CartItem, CartContextType } from '../types/CartInterfaces';
import { AuthContext } from './authContext';

const defaultCartContext: CartContextType = {
  cartItems: [],
  setCartItems: () => {},
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
  const authContext = useContext(AuthContext)!;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCartData = localStorage.getItem('cartData');
      if (storedCartData) {
        const { cartItems: storedCartItems, userId } = JSON.parse(storedCartData);
        console.log('stored', storedCartItems, authContext.user?.id, userId)
        if (authContext.user.id === Number(userId)) {
          setCartItems([...storedCartItems]);
        } 
        if(!authContext.user.id) {
          setCartItems([]);
        }
      }
  }, [authContext.user.id])
  
  const saveCartToLocalStorage = (cartItems: CartItem[], userId: number | null) => {
    const cartData = { cartItems, userId };
    localStorage.setItem('cartData', JSON.stringify(cartData));
  };

  useEffect(() => {
    if (authContext.user?.id) {
      saveCartToLocalStorage(cartItems, authContext.user.id);
    }
  }, [cartItems, authContext.user?.id]);

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
        .filter((item): item is CartItem => item !== null); 
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotals, setCartItems}}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
