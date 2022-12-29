import axios from 'axios';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { API_BASE_URL } from '../config';

const baseURL = API_BASE_URL;

const useCustomerAxios = () => {
  const { userWalletAddress } = useContext(WalletContext);

  const axiosInstance = axios.create({
    baseURL,
    params: {
      wallet_address: userWalletAddress,
    },
  });

  return axiosInstance;
};

export default useCustomerAxios;
