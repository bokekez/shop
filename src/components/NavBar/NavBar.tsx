import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import cart from '../../resources/cart.png';
import Login from '../Login/Login';
import { AuthContext } from '../../context/authContext';
import arrowDown from '../../resources/down-arrow.png';
import homeIcon from '../../resources/home.png';
import { CartContext } from '../../context/cartContext';

const NavBar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [logoutDialog, setLogoutDialog] = useState<boolean>(false);
  const [smallScreen, setSmallScreen] = useState<boolean>(false);
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (window.innerWidth <= 500 && window.innerHeight <= 900) setSmallScreen(true);
  }, []);

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
    setLogoutDialog(logoutDialog ? false : true);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link to="/" className={styles.homeLink}>
            <img src={homeIcon} className={styles.homeIcon}></img>
            {!smallScreen && 'Kings Shop'}
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link to="/products">Products</Link>
        </div>

        <div className={styles.navActions}>
          {authContext?.user?.username ? (
            <div className={styles.loggedContainer}>
              <Link to="/cart">
                <button className={`${styles.cartButton} ${styles.cartContainer}`}>
                  {!smallScreen && (
                    <p className={styles.total}>{cartContext?.cartTotals.totalPrice.toFixed(2)}$</p>
                  )}
                  <img src={cart} className={styles.homeIcon}></img>
                  <p>{cartContext?.cartTotals.totalItems}</p>
                </button>
              </Link>
              <div className={styles.userDropdown} onClick={showLogout}>
                <span className={styles.username}>{authContext.user.username}</span>
                <img src={arrowDown} className={styles.downArrow}></img>
                {logoutDialog && (
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button onClick={handleLoginClick} className={styles.loginButton}>
              Login
            </button>
          )}
        </div>
      </div>

      {isLoginOpen && <Login handleCloseLoginDialog={handleCloseLoginDialog} />}
    </nav>
  );
};

export default NavBar;
