export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  stock?: number;
}

export interface CartTotals {
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem, addQuantity: number) => void;
  removeFromCart: (id: number, quantityToRemove: number) => void;
  clearCart: () => void;
  cartTotals: CartTotals;
}
