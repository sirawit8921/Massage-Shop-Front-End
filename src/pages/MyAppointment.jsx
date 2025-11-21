import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyReservations } from "../features/reservation/reservationSlice";

function MyAppointments() {
  const dispatch = useDispatch();

  const { reservations, isLoading } = useSelector(
    (state) => state.reservation
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getMyReservations());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <p>Loading your reservations...</p>;
  }

  return (
    <div className="container">
      <h1>My Appointments</h1>

      {reservations.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {reservations.map((item) => (
            <li key={item._id} className="appointment-card">
              <strong>Date:</strong> {item.date} <br />
              <strong>Time:</strong> {item.time} <br />
              <strong>Status:</strong> {item.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyAppointments;
