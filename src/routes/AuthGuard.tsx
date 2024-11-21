import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 

interface AuthGuardProps {
  children: React.ReactNode; 
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext?.user?.username) {
    return (
      <Navigate to="/" replace />
    )
  }

  return <>{children}</>;
};

export default AuthGuard;