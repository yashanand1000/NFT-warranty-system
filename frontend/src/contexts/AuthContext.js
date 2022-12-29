import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_AUTH_BASE_URL } from '../config';

const baseURL = API_AUTH_BASE_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    const response = await fetch(baseURL + '/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/retailer/dashboard');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const registerUser = async (
    first_name,
    last_name,
    email,
    password,
    password2
  ) => {
    const response = await fetch(baseURL + '/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        password2,
      }),
    });
    const data = await response.json();

    if (response.status === 201) {
      navigate('/retailer/login');
    } else {
      throw data[Object.keys(data)[0]];
    }
  };

  const confirmPassword = async (email, password) => {
    const response = await fetch(baseURL + '/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    setAuthTokens(data);
    setUser(jwt_decode(data.access));
    localStorage.setItem('authTokens', JSON.stringify(data));
    toast.success('Profile updated successfully.');
    navigate('/retailer/profile');
  };

  const updateUser = async (first_name, last_name, email, id) => {
    const response = await fetch(baseURL + '/update/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
      }),
    });
    if (response.status === 200) {
      navigate('/retailer/confirmPassword', { state: { email } });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    confirmPassword,
    updateUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
