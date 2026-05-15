import axios from 'axios';

const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://crispii.onrender.com';



// ================= GET PRODUCTS =================

export const getProducts = async () => {

  const response = await axios.get(
    `${API_URL}/api/products`
  );

  return response.data.products;

};



// ================= CREATE PRODUCT =================

export const createProduct = async (productData) => {

  const response = await axios.post(
    `${API_URL}/api/products`,
    productData
  );

  return response.data;

};



// ================= UPDATE PRODUCT =================

export const updateProduct = async (
  productId,
  productData
) => {

  const response = await axios.put(
    `${API_URL}/api/products/${productId}`,
    productData
  );

  return response.data;

};



// ================= UPDATE STOCK =================

export const updateStock = async (
  productId,
  stock
) => {

  const response = await axios.patch(
    `${API_URL}/api/products/stock/${productId}`,
    { stock }
  );

  return response.data;

};



// ================= DELETE PRODUCT =================

export const deleteProduct = async (
  productId
) => {

  const response = await axios.delete(
    `${API_URL}/api/products/${productId}`
  );

  return response.data;

};


// ================= BULK UPDATE ALL STOCK =================
export const updateAllProductStock = async (stock) => {
  const response = await axios.put(
    `${API_URL}/api/products/update-all-stock`,
    { stock }
  );
  return response.data;
};