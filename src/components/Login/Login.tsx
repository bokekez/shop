import React, { useState } from 'react';
import styles from './Login.module.css';
import { loginUser } from '../../api/authApi'
import {
  showToastifyError,
  showToastifySuccess,
} from '../../config/toastifyConfig';

interface LoginProps {
  handleCloseLoginDialog: () => void;
}

const Login: React.FC<LoginProps> = ({ handleCloseLoginDialog }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(username, password);
      localStorage.setItem('authToken', data.token);
      handleCloseLoginDialog();
      showToastifySuccess(`${username} logged in successfully!`);
    } catch {
      showToastifyError('Invalid username or password. Please try again.');
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.dialogBackdrop} onClick={handleCloseLoginDialog}>
      <div className={styles.dialog} onClick={stopPropagation}>
        <h2>Login</h2>
        <button onClick={handleCloseLoginDialog} className={styles.closeDialog}>
          Close
        </button>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={handleUsernameChange} required />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} required />
          </label>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
