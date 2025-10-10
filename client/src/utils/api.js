import axiosInstance from './axiosInstance';

// Register a user
export const registerUser = async (data) => {
  const res = await axiosInstance.post('/register', data);
  if (res.data.token) {
    localStorage.setItem('authToken', res.data.token); // Save token on register/login
  }
  return res.data;
};

// Login a user
export const loginUser = async (data) => {
  const res = await axiosInstance.post('/login', data);
  if (res.data.token) {
    localStorage.setItem('authToken', res.data.token);
  }
  return res.data;
};

// Request forgot password OTP
export const forgotPassword = async (data) => {
  const res = await axiosInstance.post('/forgot-password', data);
  return res.data;
};

// Reset user password
export const resetPassword = async (data) => {
  const res = await axiosInstance.post('/reset-password', data);
  return res.data;
};
