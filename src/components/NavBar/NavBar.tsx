import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import cart from '../../resources/cart.png'
import Login from '../Login/Login';
import { AuthContext } from '../../context/authContext';
import arrowDown from '../../resources/down-arrow.png'
import { CartContext } from '../../context/cartContext';

const NavBar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    if (authContext) {
      authContext.setUser({
        id: null,
        username: null,
        firstName: null,
        lastName: null,
      }); 
      cartContext?.setCartItems([]);
      localStorage.removeItem('authToken'); 
    }
  };

  const showLogout = () => {
    setLogoutDialog(logoutDialog ? false : true)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo}>
          <Link to="shop/">Kings Shop</Link>
        </h1>

        <ul className={styles.navLinks}>
          <li>
            <Link to="shop/products">Products</Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          { authContext?.user?.username ? (
            <div className={styles.loggedContainer}>
            <Link to="shop/cart">
            <button className={`${styles.cartButton} ${styles.cartContainer}`}>   
              <p className={styles.total}>{cartContext?.cartTotals.totalPrice.toFixed(2)}$</p>
              <img src={cart}></img>
              <p>{cartContext?.cartTotals.totalItems}</p>
            </button>
            </Link>
             <div className={styles.userDropdown} onClick={showLogout}>
             <span className={styles.username} >{authContext.user.username}</span>
             <img src={arrowDown} className={styles.downArrow}></img>
             { logoutDialog && <button onClick={handleLogout} className={styles.logoutButton}>
               Logout
             </button>}
             </div>
            </div> 
           ) : (
          <button onClick={handleLoginClick} className={styles.loginButton}>
            Login
          </button>
          )}
        </div>
      </div>

      {isLoginOpen && <Login handleCloseLoginDialog={handleCloseLoginDialog} /> }
    </nav>
  );
};

export default NavBar;