import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import AppRoutes from './routes/routes';
import { AuthProvider } from './context/authContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <NavBar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};
export default App;
