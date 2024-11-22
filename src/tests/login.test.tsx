import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login/Login';
import { loginUser } from '../api/authApi';
import { showToastifyError, showToastifySuccess } from '../config/toastifyConfig';
import { AuthContext } from '../context/authContext';
import '@testing-library/jest-dom';

jest.mock('../api/authApi', () => ({
  loginUser: jest.fn(),
}));

jest.mock('../config/toastifyConfig', () => ({
  showToastifyError: jest.fn(),
  showToastifySuccess: jest.fn(),
}));

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('Login Component', () => {
  const mockSetUser = jest.fn();
  const mockHandleCloseLoginDialog = jest.fn();

  const mockAuthContext = {
    user: {
      id: 1,
      firstName: '',
      lastName: '',
      username: '',
    },
    checkToken: false,
    setUser: mockSetUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Login component', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login handleCloseLoginDialog={mockHandleCloseLoginDialog} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('calls loginUser and sets user on successful login', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      accessToken: 'mockToken',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    });

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login handleCloseLoginDialog={mockHandleCloseLoginDialog} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mockToken');
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(mockHandleCloseLoginDialog).toHaveBeenCalled();
      expect(showToastifySuccess).toHaveBeenCalledWith('testuser logged in successfully!');
    });
  });

  test('shows an error message on invalid credentials', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      message: 'Invalid credentials',
    });

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login handleCloseLoginDialog={mockHandleCloseLoginDialog} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('wronguser', 'wrongpassword');
      expect(showToastifyError).toHaveBeenCalledWith(
        'Invalid username or password. Please try again.',
        'login'
      );
    });
  });

  test('shows a generic error on login failure', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login handleCloseLoginDialog={mockHandleCloseLoginDialog} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(showToastifyError).toHaveBeenCalledWith(
        'Invalid username or password. Please try again.'
      );
    });
  });

  test('stops propagation on dialog click', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login handleCloseLoginDialog={mockHandleCloseLoginDialog} />
      </AuthContext.Provider>
    );

    const dialogElement = screen.getByText('Login');

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation');

    dialogElement.dispatchEvent(clickEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
