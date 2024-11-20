import { createContext, useState, ReactNode, FC, useEffect } from 'react';
import { User, AuthContextType } from '../types/UserInterfaces';
import { checkUserToken } from '../api/authApi';
import { showToastifySuccess } from '../config/toastifyConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: null,
    username: null,
    firstName: null,
    lastName: null,
  });
  const [checkToken, setCheckToken] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await checkUserToken(token);
          if (
            userData.message === 'Invalid/Expired Token!' ||
            userData.message === 'Token Expired!'
          )
            return;
          setUser(userData);
          showToastifySuccess(`Welcome back ${userData.firstName}`);
        } catch {
          setUser({
            id: null,
            username: null,
            firstName: null,
            lastName: null,
          });
          localStorage.removeItem('authToken');
        }
      }
      setCheckToken(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkToken }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext };
