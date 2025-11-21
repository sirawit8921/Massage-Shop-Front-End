import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const warned = useRef(false);

  useEffect(() => {
    // ถ้า user ไม่มี และมาจาก logout → ให้ไปหน้า Home ไม่ต้องเตือน
    if (!user && location.state?.fromLogout) {
      navigate("/", { replace: true });
      return;
    }

    // ไม่ต้องเตือนถ้าอยู่หน้า login
    if (location.pathname === "/login") return;

    if (!user && !warned.current) {
      warned.current = true;

      let message = "Please login first.";

      if (location.pathname === "/create-appointment") {
        message = "Please login before creating your appointment.";
      } else if (location.pathname === "/my-appointments") {
        message = "Please login before viewing your appointments.";
      }

      toast.warning(message, {
        autoClose: 1000,
        position: "top-center",
        hideProgressBar: true,
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    }
  }, [user, navigate, location.pathname, location.state]);

  if (!user) return null;

  return children;
}

export default PrivateRoute;
