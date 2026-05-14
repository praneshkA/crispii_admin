import axios from 'axios';
import { BASE_API_URL } from '../config';

const API = `${BASE_API_URL}/api/orders`;

export const getAllOrders = async () => {
  const res = await axios.get(`${API}/all`);
  return res.data;
};

export const updateOrderStatus = async (orderId, payload) => {
  const res = await axios.put(`${API}/${orderId}`, payload);
  return res.data;
};

export const confirmOrderPayment = async (orderId) => {
  const payload = {
    orderStatus: 'confirmed',
    paymentStatus: 'successful',
  };

  const res = await axios.put(`${API}/${orderId}`, payload);

  return res.data;
};