import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import cart from '../../resources/cart.png'
import Login from '../Login/Login';

const NavBar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setIsLoginOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <h1 className={styles.logo}>
          <Link to="/">Kings Shop</Link>
        </h1>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>

        {/* Right-side Actions */}
        <div className={styles.navActions}>
          {/* Cart Button */}
          <button className={styles.cartButton}>
            <img src={cart}></img>
            {/* <FaShoppingCart size={20} /> */}
          </button>

          {/* Login Button */}
          <button onClick={handleLoginClick} className={styles.loginButton}>
            Login
          </button>
        </div>
      </div>

      {isLoginOpen && <Login handleCloseLoginDialog={handleCloseLoginDialog} /> }
    </nav>
  );
};

export default NavBar;
