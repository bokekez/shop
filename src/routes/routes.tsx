import { Routes, Route } from 'react-router-dom';
import Products from '../views/Products/Products';
import Home from '../views/Home/Home';
import ProductDetails from '../views/ProductDetails/ProductDetails';
import Cart from '../views/Cart/Cart';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;
