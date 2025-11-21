import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// ⭐ ใช้ชื่อไฟล์ตามที่มีอยู่จริง
import CreateAppointment from "./pages/CreateAppointment";
import MyAppointment from "./pages/MyAppointment";
import CheckReservation from "./pages/CheckReservation";

// ⭐ PrivateRoute
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />

            {/* 🔒 Protected */}
            <Route
              path="/create-appointment"
              element={
                <PrivateRoute>
                  <CreateAppointment />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-appointments"
              element={
                <PrivateRoute>
                  <MyAppointment />
                </PrivateRoute>
              }
            />

            <Route
              path="/check-reservation"
              element={
                <PrivateRoute>
                  <CheckReservation />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
