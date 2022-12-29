import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

const CustomerProtectedRoute = ({ children }) => {
  let { customer, ownerLogin } = useContext(WalletContext);
  if (customer) {
    return children;
  } else if (window.location.pathname) {
    ownerLogin(window.location.pathname);
  } else {
    ownerLogin('/customer/dashboard');
  }
};

export default CustomerProtectedRoute;
