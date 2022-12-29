import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_AUTH_BASE_URL } from '../config';
import InstallMetamask from '../components/InstallMetamask';

const baseURL = API_AUTH_BASE_URL;
const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null); // eslint-disable-line
  const [loading, setLoading] = useState(true);
  const [userWalletAddress, setUserWalletAddress] = useState(
    localStorage.getItem('userWalletAddress')
      ? localStorage.getItem('userWalletAddress')
      : ''
  );

  const ownerLogin = async (redirectTo) => {
    if (localStorage.getItem('userWalletAddress')) {
      try {
        const response = await fetch(baseURL + '/owner/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: localStorage.getItem('userWalletAddress'),
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setCustomer(data);
          navigate(redirectTo);
        } else {
          navigate('/customer/register');
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    }
  };

  const updateOwner = async (owner_name, phno, owner_id) => {
    const response = await fetch(baseURL + '/owner/update/' + owner_id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: owner_name,
        phno: phno,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      const customer_data = {
        name: data.name,
        phno: data.phno,
        wallet_address: userWalletAddress,
      };
      setCustomer(customer_data);
      toast.success('Profile updated successfully');
      navigate('customer/dashboard/');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const registerOwner = async (name, phone) => {
    const response = await fetch(baseURL + '/owner/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        phno: phone,
        wallet_address: userWalletAddress,
      }),
    });
    const data = await response.json();
    if (response.status === 201) {
      setCustomer(data);
      navigate('/customer/dashboard');
    } else {
      throw data[Object.keys(data)[0]];
    }
  };

  const connectWallet = async (onConnected) => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts) {
        onConnected(accounts[0]);
        localStorage.setItem('userWalletAddress', accounts[0]);
        toast.success('Wallet Connected succesfully!');
        if (!customer) {
          ownerLogin();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkIfWalletIsConnected = async (onConnected) => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        onConnected(account);
        localStorage.setItem('userWalletAddress', account);
        return;
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      localStorage.removeItem('userWalletAddress');
      setUserWalletAddress('');
      setCustomer(null);
      toast.success('Logged Out succesfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const contextData = {
    customer,
    ownerLogin,
    updateOwner,
    registerOwner,
    userWalletAddress,
    setUserWalletAddress,
    connectWallet,
    disconnectWallet,
  };

  useEffect(() => {
    if (window.ethereum) {
      checkIfWalletIsConnected(setUserWalletAddress);
      setLoading(false);
    }

    if (window.ethereum) {
      window.ethereum.on('disconnect', () => {
        console.log('disconnected');
        disconnectWallet();
      });
    }
  }, []); // eslint-disable-line

  return (
    <WalletContext.Provider value={contextData}>
      {window.ethereum ? loading ? null : children : <InstallMetamask />}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };
