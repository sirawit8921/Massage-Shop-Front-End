// เส้นทาง API
import axios from "axios";

const API_URL = "http://localhost:5003/api/v1/auth/";

// Register user
const register = async (userData) => {
  console.log("REGISTER SENT:", userData);

  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  console.log("LOGIN SENT:", userData);

  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
  return;
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
