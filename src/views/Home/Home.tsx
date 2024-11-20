import React from 'react';
import logo from '../../resources/logo.png';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <img src={logo} className={styles.logo}></img>
    </div>
  );
};

export default Home;
