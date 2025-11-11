import React, { useEffect, useState } from 'react'

/*
  Reservation.jsx (updated to match Reservation Management requirements)

  Features:
  - Create reservation with validation: must be at least 30 minutes in advance.
  - Reservation statuses: "reserved", "activated" (checked-in), "cancelled".
  - Cancel reservation UI.
  - Availability endpoint placeholder for demo purposes.
  - LocalStorage fallback for testing without backend.

  Integration steps:
  1. Place this file in: `src/pages/Reservation.jsx`
  2. Add route: <Route path="/reservation" element={<Reservation />} />
  3. You can later connect to backend or gRPC client inside reservationService.
*/

// ---------------------- Config ----------------------
const CHECKIN_RADIUS_METERS = 100 // distance threshold for check-in (not used here, but reserved for future use)
const MIN_ADVANCE_MINUTES = 30 // reservation must be at least 30 mins ahead

// ---------------------- Helper (Haversine formula) ----------------------
// Used if you want to calculate distance between two coordinates (e.g. for check-in validation)
function metersBetween(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180
  const R = 6371000 // radius of Earth in meters
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ---------------------- reservationService ----------------------
const reservationService = {
  /*
    Create a new reservation:
    - Checks if reservation time is valid (at least MIN_ADVANCE_MINUTES ahead)
    - Saves to localStorage for demo use
  */
  async createReservation(payload) {
    const requested = new Date(payload.datetime)
    const minAllowed = new Date(Date.now() + MIN_ADVANCE_MINUTES * 60 * 1000)

    if (requested < minAllowed) {
      const err = new Error(`Reservation must be at least ${MIN_ADVANCE_MINUTES} minutes in advance`)
      err.code = 'TOO_EARLY'
      throw err
    }

    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    const id = Date.now().toString()

    const obj = {
      id,
      name: payload.name,
      phone: payload.phone,
      datetime: payload.datetime,
      service: payload.service,
      stadium: payload.stadium || { id: 'demo-stadium', name: 'Demo Stadium', lat: 13.736717, lon: 100.523186 },
      status: 'reserved',
      createdAt: new Date().toISOString(),
    }

    existing.unshift(obj)
    localStorage.setItem('demo_reservations', JSON.stringify(existing))
    return obj
  },

  /*
    Return all reservations saved in localStorage
  */
  async listReservations() {
    return JSON.parse(localStorage.getItem('demo_reservations') || '[]')
  },

  /*
    Cancel a reservation (mark as "cancelled")
  */
  async cancelReservation(id) {
    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    const idx = existing.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Reservation not found')

    existing[idx].status = 'cancelled'
    localStorage.setItem('demo_reservations', JSON.stringify(existing))
    return existing[idx]
  },

  /*
    Return demo availability slots (for UI testing)
  */
  async checkAvailability(stadiumId, date) {
    return [
      { start: `${date}T09:00:00`, durationMinutes: 60 },
      { start: `${date}T10:00:00`, durationMinutes: 60 },
      { start: `${date}T11:00:00`, durationMinutes: 60 },
    ]
  },
}

// ---------------------- Reservation Page ----------------------
export default function Reservation() {
  // form state
  const [form, setForm] = useState({ name: '', phone: '', datetime: '', service: '' })
  // list of appointments
  const [appointments, setAppointments] = useState([])
  // loading indicator
  const [loading, setLoading] = useState(false)
  // error handler
  const [error, setError] = useState(null)
  // available time slots
  const [availability, setAvailability] = useState([])

  // load reservations on mount
  useEffect(() => {
    refresh()
  }, [])

  /*
    Fetch reservation list from localStorage
  */
  async function refresh() {
    setLoading(true)
    try {
      const list = await reservationService.listReservations()
      setAppointments(list)
    } catch {
      setError('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  /*
    Handle reservation form submission
  */
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // basic validation
    if (!form.name || !form.datetime) {
      setError('Please fill out required fields.')
      return
    }

    try {
      setLoading(true)
      const stadium = { id: 'demo-stadium', name: 'Demo Stadium' }

      const created = await reservationService.createReservation({
        name: form.name,
        phone: form.phone,
        datetime: form.datetime,
        service: form.service,
        stadium,
      })

      // add new reservation to state
      setAppointments(prev => [created, ...prev])
      setForm({ name: '', phone: '', datetime: '', service: '' })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  /*
    Cancel an existing reservation
  */
  async function handleCancel(id) {
    if (!confirm('Cancel this reservation?')) return
    try {
      setLoading(true)
      await reservationService.cancelReservation(id)
      await refresh()
    } catch {
      setError('Failed to cancel reservation')
    } finally {
      setLoading(false)
    }
  }

  /*
    Get available slots for demo
  */
  async function fetchAvailability() {
    try {
      const dateOnly = (new Date()).toISOString().slice(0, 10)
      const slots = await reservationService.checkAvailability('demo-stadium', dateOnly)
      setAvailability(slots)
    } catch {
      setError('Failed to load availability')
    }
  }

  // ---------------------- Render ----------------------
  return (
    <div style={{ padding: 20 }}>
      <h1>Reservation</h1>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* --------- FORM --------- */}
        <form onSubmit={handleSubmit} style={{ minWidth: 340, maxWidth: 420 }}>
          <div className="form-group">
            <label>Name</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input className="input" type="datetime-local" value={form.datetime} onChange={e => setForm({ ...form, datetime: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Service</label>
            <input className="input" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="Service detail" />
          </div>

          {/* --------- BUTTONS --------- */}
          <div className="reservation-buttons">
            <button type="submit" disabled={loading} className="btn-black">{loading ? 'Saving…' : 'Create Reservation'}</button>
            <button type="button" onClick={refresh} className="btn-black">Refresh</button>
            <button type="button" onClick={fetchAvailability} className="btn-black">Check Availability</button>
          </div>

          {/* error message */}
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </form>

        {/* --------- APPOINTMENTS LIST --------- */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2>Appointments</h2>
          {loading && <div>Loading...</div>}
          {!loading && appointments.length === 0 && (
            <div style={{ color: '#444', marginTop: 20 }}>No appointments found.</div>
          )}

          <ul style={{ padding: 0, listStyle: 'none', marginTop: 20 }}>
            {appointments.map(a => (
              <li
                key={a.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 16,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Left side (details) */}
                  <div>
                    <strong>{a.name}</strong> — <em>{a.stadium?.name}</em>
                    <div style={{ fontSize: '0.9rem', marginTop: 4 }}>{new Date(a.datetime).toLocaleString()}</div>
                    <div style={{ color: '#555', marginTop: 6 }}>{a.service}</div>
                    <div style={{ color: '#777' }}>{a.phone}</div>
                    <div style={{ marginTop: 8, color: '#555' }}>
                      <span style={{ fontWeight: 600 }}>Status:</span>{' '}
                      <span style={{ fontWeight: 700 }}>{a.status}</span>
                    </div>
                  </div>

                  {/* Right side (buttons) */}
                  {a.status === 'reserved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button className="btn-black-small">Check-in</button>
                      <button onClick={() => handleCancel(a.id)} className="btn-black-small">Cancel</button>
                    </div>
                  )}
                  {a.status === 'cancelled' && <span style={{ color: 'gray', fontWeight: 500 }}>Cancelled</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --------- STYLES --------- */}
      <style>{`
        .input {
          width: 100%;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-family: inherit;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .btn-black {
          background-color: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 6px;
          padding: 10px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-black:hover {
          background-color: #19dc26;
          border-color: #19dc26;
          color: #fff;
        }

        .btn-black-small {
          background-color: #000;
          color: #fff;
          border: 1.5px solid #000;
          border-radius: 6px;
          padding: 6px 14px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-black-small:hover {
          background-color: #19dc26;
          border-color: #19dc26;
          transform: translateY(-1px);
        }

        .reservation-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 15px;
        }
      `}</style>
    </div>
  )
}
