import React, { useState, useContext } from 'react';
import styles from './Login.module.css';
import { loginUser } from '../../api/authApi';
import { showToastifyError, showToastifySuccess } from '../../config/toastifyConfig';
import { LoginProps } from '../../types/LoginModels';
import { AuthContext } from '../../context/authContext';

const Login: React.FC<LoginProps> = ({ handleCloseLoginDialog }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const authContext = useContext(AuthContext);

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
      if (data.message === 'Invalid credentials') {
        return showToastifyError('Invalid username or password. Please try again.', 'login');
      }
      localStorage.setItem('authToken', data.accessToken);
      authContext?.setUser({
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      });
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
        <button onClick={handleCloseLoginDialog} className={styles.closeDialog}>
          X
        </button>
        <h2>Login</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
              className={styles.loginInput}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={styles.loginInput}
            />
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
