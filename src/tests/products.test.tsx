import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../views/Products/Products';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';
import { fetchProducts, fetchProductsByCategoy, searchProducts } from '../api/productApi';
import { fetchCategories } from '../api/categoriesApi';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../api/productApi', () => ({
  fetchProducts: jest.fn(),
  fetchProductsByCategoy: jest.fn(),
  searchProducts: jest.fn(),
}));

jest.mock('../api/categoriesApi', () => ({
  getBaseUrl: jest.fn(),
  fetchCategories: jest.fn(),
}));

jest.mock('../config/toastifyConfig', () => ({
  showToastifyError: jest.fn(),
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

const mockProducts = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 100,
    stock: 10,
    category: 'Electronics',
    description: 'A sample product',
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 200,
    stock: 5,
    category: 'Books',
    description: 'Another sample product',
  },
];

const mockCategories = [
  {
    name: 'Electronics',
  },
];

describe('Products View', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Products view and displays a loading state initially', async () => {
    (fetchProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 2,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <Products />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(document.querySelector('.tableSpinner')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalled();

    const test = () => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    };

    await waitFor(() => {
      test();
    });
  });

  test('applies filters correctly', async () => {
    const mockFilteredProducts = [
      {
        id: 1,
        title: 'Test Product 1',
        price: 100,
        stock: 10,
        category: 'Electronics',
        description: 'A sample product',
      },
    ];
    (fetchCategories as jest.Mock).mockResolvedValue(mockCategories);
    (fetchProductsByCategoy as jest.Mock).mockResolvedValue({
      products: mockFilteredProducts,
      total: 1,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <Products />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(fetchCategories).toHaveBeenCalled();
    await waitFor(() => expect(fetchProducts).toHaveBeenCalled());

    const filterByCat = () => {
      const categoryFilter = screen.getByLabelText(/category/i);
      fireEvent.change(categoryFilter, { target: { value: 'Electronics' } });

      const applyFiltersButton = screen.getByText(/apply filters/i);
      fireEvent.click(applyFiltersButton);
    };

    await waitFor(() => {
      filterByCat();
    });

    await waitFor(() =>
      expect(fetchProductsByCategoy).toHaveBeenCalledWith(
        'Electronics',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        undefined
      )
    );

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    const fillObj = {
      id: 3,
      title: 'Test Product 3',
      price: 100,
      stock: 10,
      category: 'Electronics',
      description: 'A sample product',
    };
    const extendedMockProducts = mockProducts.concat(
      Array(30)
        .fill(null)
        .map((_, index) => ({
          ...fillObj,
          id: mockProducts.length + index + 1, 
        }))
    );
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      products: extendedMockProducts.slice(0, 20),
      total: 30,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <Products />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchProducts).toHaveBeenCalled());

    await waitFor(() => {
      const nextPageButton = screen.getByText(/next/i);
      fireEvent.click(nextPageButton);
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(fetchProducts).toHaveBeenCalledTimes(2);
    });

    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      products: extendedMockProducts.slice(21),
      total: 30,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <Products />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Page 2/)).toBeInTheDocument();
    });
  });

  test('handles product search', async () => {
    const mockSearchedProducts = [
      {
        id: 2,
        title: 'Test Product 2',
        price: 200,
        stock: 5,
        category: 'Books',
        description: 'Another sample product',
      },
    ];

    (searchProducts as jest.Mock).mockResolvedValueOnce({
      products: mockSearchedProducts,
      total: 1,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <CartContext.Provider value={mockCartContext}>
            <Products />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchProducts).toHaveBeenCalled());

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Test Product 2' } });

    const searchButton = screen.getByText(/search/i);
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(
        'Test Product 2',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        undefined
      )
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
    });
  });
});
