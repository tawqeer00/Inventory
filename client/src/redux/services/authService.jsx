import axios from 'axios';
import {toast} from "react-toastify";
import {REACT_APP_BACKEND_URL} from  '../../env'


export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${REACT_APP_BACKEND_URL}/users/register`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Login User
export const loginUser = async (userData) => {
    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/users/login`,
        userData
      );
      if (response.statusText === "OK") {
        toast.success("Login Successful...");
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  
  // Logout User
  export const logoutUser = async () => {
    try {
      await axios.get(`${REACT_APP_BACKEND_URL}/users/logout`);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  
  // Forgot Password
  export const forgotPassword = async (userData) => {
    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/users/forgotpassword`,
        userData
      );
      toast.success(response.data.message);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  
  // Reset Password
  export const resetPassword = async (userData, resetToken) => {
    try {
      const response = await axios.put(
        `${REACT_APP_BACKEND_URL}/users/resetpassword/${resetToken}`,
        userData
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  
  // Get Login Status
  export const getLoginStatus = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/users/loggedin`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  // Get User Profile
  export const getUser = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/users/getuser`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  // Update Profile
  export const updateUser = async (formData) => {
    try {
      const response = await axios.patch(
        `${REACT_APP_BACKEND_URL}/users/updateuser`,
        formData
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  // Update Profile
  export const changePassword = async (formData) => {
    try {
      const response = await axios.patch(
        `${REACT_APP_BACKEND_URL}/users/changepassword`,
        formData
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };
  
  
  
  
  