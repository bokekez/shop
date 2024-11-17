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

  console.log('nav cart', cartContext)
  
  // const logoutRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     console.log('Clicked target:', event.target, logoutRef);
  //     if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
  //       console.log('Click outside detected');
  //       setLogoutDialog(false); 
  //     }
  //   };

  //   document.addEventListener('click', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);

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
          <Link to="/">Kings Shop</Link>
        </h1>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          { authContext?.user?.username ? (
            <div className={styles.loggedContainer}>
            <button className={styles.cartButton}>
              <img src={cart}></img>
            </button>
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
