// เส้นทาง API
import axios from 'axios'

const API_URL = 'http://localhost:5003/api/users'

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  console.log(response.data)
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  console.log(response.data)
  return response.data
}

// Logout user
const logout = async () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  logout,
  login
}

const reservationService = {
  async listReservations() {
    const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล user ปัจจุบัน
    if (!user || !user.id) throw new Error("User not logged in");

    const res = await axios.get(`http://localhost:5003/api/reservations?userId=${user.id}`);
    return res.data;
  },
};

export default authService
