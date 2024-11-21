import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetails from '../views/ProductDetails/ProductDetails';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';
import { fetchProductById } from '../api/productApi';
import { showToastifyError, showToastifySuccess } from '../config/toastifyConfig';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';

jest.mock('../api/productApi', () => ({
  fetchProductById: jest.fn(),
}));

jest.mock('../config/toastifyConfig', () => ({
  showToastifyError: jest.fn(),
  showToastifySuccess: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockAuthContext = {
  user: {
    id: 1,
    firstName: 'test',
    lastName: 'user',
    username: 'testuser',
  },
  checkToken: false,
  setUser: jest.fn(),
};
const mockCartContext = {
  cartItems: [],
  addToCart: jest.fn(),
  setCartItems: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  cartTotals: { totalItems: 0, totalPrice: 0 },
};

describe('ProductDetails', () => {
  const mockResponse = {
    id: 1,
    title: 'Test Product',
    price: 100,
    discountPercentage: 20,
    description: 'This is a test product.',
    category: 'Electronics',
    brand: 'Brand A',
    stock: 10,
    rating: 4.5,
    thumbnail: 'img1.jpg',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
  };
  test('renders product details correctly', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (fetchProductById as jest.Mock).mockResolvedValue(mockResponse);
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <ProductDetails />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(fetchProductById).toHaveBeenCalled());

    const test = () => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText(/Discount: 20%/)).toBeInTheDocument();
      expect(screen.getByText('This is a test product.')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Brand A')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    };

    await waitFor(() => {
      test();
    });
  });

  test('handles adding product to cart', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (fetchProductById as jest.Mock).mockResolvedValue(mockResponse);
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <ProductDetails />
          </CartContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => screen.getByText(/Test Product/));

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '5' } });

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockCartContext.addToCart).toHaveBeenCalledWith(
      {
        id: 1,
        title: 'Test Product',
        price: 100,
        quantity: 0,
        thumbnail: 'img1.jpg',
      },
      5
    );

    expect(showToastifySuccess).toHaveBeenCalledWith('5 item(s) added to the cart!');
  });

  test('displays error if out of stock', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (fetchProductById as jest.Mock).mockResolvedValue(mockResponse);
    const cartItemMock = {
      id: 1,
      title: 'Test Product',
      price: 100,
      quantity: 2,
      thumbnail: 'image_url',
    };
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={{ ...mockCartContext, cartItems: [cartItemMock] }}>
            <ProductDetails />
          </CartContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => screen.getByText(/Test Product/));

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '10' } });

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(showToastifyError).toHaveBeenCalledWith(
      'Cannot add more than available stock.',
      'moreThenStock'
    );
  });
});
