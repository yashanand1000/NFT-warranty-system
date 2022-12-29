import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const RetailerProtectedRoute = ({ children }) => {
  let { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/retailer/login" />;
};

export default RetailerProtectedRoute;
