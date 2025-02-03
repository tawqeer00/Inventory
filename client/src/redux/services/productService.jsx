import axios from "axios";
import {REACT_APP_BACKEND_URL} from  '../../env'



const API_URL = `${REACT_APP_BACKEND_URL}/products/`;
console.log(API_URL)

// Create New Product
const createProduct = async (formData) => {
  console.log(formData,"create product");
  const response = await axios.post(`${REACT_APP_BACKEND_URL}/products/`, formData);
  
  return response.data;
};

// Get all products
const getProducts = async () => {
  const response = await axios.get(`${REACT_APP_BACKEND_URL}/products/`);
  return response.data;
};

// Delete a Product
const deleteProduct = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};


// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};
// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};

export default productService;
