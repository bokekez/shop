import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../views/Cart/Cart';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';
import { BrowserRouter } from 'react-router-dom';
import { showToastifySuccess, showToastifyWarning } from '../config/toastifyConfig';
import '@testing-library/jest-dom';

jest.mock('../config/toastifyConfig', () => ({
  showToastifySuccess: jest.fn(),
  showToastifyWarning: jest.fn(),
}));

const mockCartContext = {
  cartItems: [
    { id: 1, title: 'Product A', price: 10, quantity: 2, thumbnail: 'a.jpg' },
    { id: 2, title: 'Product B', price: 15, quantity: 1, thumbnail: 'b.jpg' },
  ],
  addToCart: jest.fn(),
  setCartItems: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  cartTotals: { totalItems: 0, totalPrice: 0 },
};

const mockAuthContext = {
  user: {
    id: 1,
    firstName: 'test',
    lastName: 'test',
    username: 'testtest',
  },
  checkToken: false,
  setUser: jest.fn(),
};

describe('Cart View', () => {
  test('displays log-in prompt when user is not logged in', () => {
    const mockAuthContextNoUser = {
      user: {
        id: 1,
        firstName: '',
        lastName: '',
        username: '',
      },
      checkToken: false,
      setUser: jest.fn(),
    };
    render(
      <AuthContext.Provider value={mockAuthContextNoUser}>
        <CartContext.Provider value={mockCartContext}>
          <Cart />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Log in to view your cart')).toBeInTheDocument();
  });

  test('displays empty cart message when there are no items', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={{ ...mockCartContext, cartItems: [] }}>
          <Cart />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test('renders cart items correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter>
            <Cart />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  test('removes item from cart when remove button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter>
            <Cart />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const removeButton = screen.getAllByText('Remove')[0];
    fireEvent.click(removeButton);

    expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1, 2);
    expect(showToastifySuccess).toHaveBeenCalledWith('Items removed');
  });

  test('shows warning for invalid quantity input', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter>
            <Cart />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '0' } });

    expect(showToastifyWarning).toHaveBeenCalledWith('Must remove at least one item', 'removeMin');
  });

  test('clears cart when "Buy All" is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter>
            <Cart />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const buyAllButton = screen.getByText('Buy All');
    fireEvent.click(buyAllButton);

    expect(mockCartContext.clearCart).toHaveBeenCalled();
    expect(showToastifySuccess).toHaveBeenCalledWith('All items bought successfully!');
  });
});
