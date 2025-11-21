import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyReservations } from "../features/reservation/reservationSlice";

function CheckReservation() {
  const dispatch = useDispatch();
  const { reservations, isLoading } = useSelector((state) => state.reservation);

  useEffect(() => {
    dispatch(getMyReservations());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <ul>
          {reservations.map((item) => (
            <li key={item._id}>
              <strong>Date:</strong> {item.date}<br />
              <strong>Time:</strong> {item.time}<br />
              <strong>Status:</strong> {item.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CheckReservation;
