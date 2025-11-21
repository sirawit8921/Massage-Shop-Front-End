import axios from "axios";

const API_URL = "http://localhost:5003/api/reservations/";

// get reservation of logged-in user
const getMyReservations = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "me", config);
  return response.data;
};

const reservationService = {
  getMyReservations,
};

export default reservationService;
