import { Routes, Route } from 'react-router-dom';
import Products from '../views/Products/Products';
import Home from '../views/Home/Home';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
};

export default AppRoutes;
