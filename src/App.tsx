import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import AppRoutes from './routes/routes';

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <NavBar />
      <AppRoutes />
    </Router>
  );
};
export default App;
