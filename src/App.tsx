import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import AppRoutes from './routes/routes';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer />
          <NavBar />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};
export default App;
