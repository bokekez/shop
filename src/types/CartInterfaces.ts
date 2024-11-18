export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface CartTotals {
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartTotals: CartTotals;
}
