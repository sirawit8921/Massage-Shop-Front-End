import React, { useEffect, useState } from "react";

/*
  Appointment.jsx
  - Shows user's reservations
  - Uses the same reservationService interface expected by Reservation.jsx

  Integration:
  1. Place this file in src/pages/Appointment.jsx
  2. Add route: <Route path="/appointment" element={<Appointment />} />
  3. Ensure reservationService.listReservations() resolves reservations for current user
*/

const reservationService = {
  async listReservations() {
    const existing = JSON.parse(localStorage.getItem("demo_reservations") || "[]");
    return existing;
  },
};

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const list = await reservationService.listReservations();
      setAppointments(list);
    } catch (e) {
      console.error(e);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Appointments</h1>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && appointments.length === 0 && <div>No reservations found.</div>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {appointments.map((a) => (
          <li
            key={a.id}
            style={{
              marginBottom: 12,
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{a.name}</strong> — <em>{a.stadium?.name || "Stadium"}</em>
                <div>{a.service}</div>
                <div style={{ color: "#666" }}>Status: {a.status}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {new Date(a.datetime).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
