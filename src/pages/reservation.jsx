import React, { useEffect, useState } from 'react'

/*
  Reservation.jsx (updated to match Reservation Management requirements)

  Features added / changed compared to the original draft:
  - Create reservation with validation: reservation must be at least 30 minutes in advance.
  - Reservation statuses: "reserved", "activated" (checked-in), "cancelled".
  - Cancel reservation UI + gRPC hook placeholder for cancel.
  - Check-in flow that verifies geolocation is within a configurable radius of the reservation's stadium coordinates.
    * Uses browser geolocation (user permission required).
    * Uses Haversine distance check. Default radius = 100 meters (configurable).
  - Availability endpoint placeholder (reservationService.checkAvailability) to ask backend for available timeslots.
  - Fallback localStorage-based mock remains so the page works without a backend.
  - Clear instructions in comments where to plug in your grpc-web client stubs.

  Integration steps (short):
  1. Put this file at `src/pages/Reservation.jsx` in your project (replace previous file).
  2. Add a route in your router: <Route path="/reservation" element={<Reservation />} />
  3. If you have gRPC-web stubs, attach a client to window.grpcReservationClient and implement
     the commented code inside reservationService methods.
  4. Run the app and open /reservation.

  Important notes:
  - Check-in position verification must also be enforced on the server for security. Client-side checks
    are only UX convenience.
  - Auto-cancel for missed check-in should be implemented server-side (e.g. background job or TTL).
*/

// ---------------------- Config ----------------------
const CHECKIN_RADIUS_METERS = 100 // acceptable distance from stadium to allow check-in
const MIN_ADVANCE_MINUTES = 30 // reservation must be created at least this many minutes in advance

// ---------------------- Helper (Haversine) ----------------------
function metersBetween(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180
  const R = 6371000 // Earth radius in meters
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ---------------------- reservationService (wrapper + grpc hooks) ----------------------
const reservationService = {
  async createReservation(payload) {
    // Enforce MIN_ADVANCE_MINUTES on client as a UX guard. Server must enforce too.
    const requested = new Date(payload.datetime)
    const minAllowed = new Date(Date.now() + MIN_ADVANCE_MINUTES * 60 * 1000)
    if (requested < minAllowed) {
      const err = new Error(`Reservation must be at least ${MIN_ADVANCE_MINUTES} minutes in advance`)
      err.code = 'TOO_EARLY'
      throw err
    }

    // If you have a grpc client, use it here. Example (pseudo):
    // if (window.grpcReservationClient) {
    //   const req = new CreateReservationRequest()
    //   req.setName(payload.name)
    //   req.setPhone(payload.phone)
    //   req.setDatetime(payload.datetime)
    //   req.setService(payload.service)
    //   req.setStadiumId(payload.stadiumId)
    //   return new Promise((resolve, reject) => {
    //     window.grpcReservationClient.createReservation(req, {}, (err, resp) => {
    //       if (err) return reject(err)
    //       resolve(resp.toObject())
    //     })
    //   })
    // }

    // FALLBACK: save into localStorage with required fields
    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    const id = Date.now().toString()
    const obj = {
      id,
      name: payload.name,
      phone: payload.phone,
      datetime: payload.datetime,
      service: payload.service,
      // stadium info: in a real app you'd select stadium by id; the demo stores coords so check-in can be tested
      stadium: payload.stadium || { id: 'demo-stadium', name: 'Demo Stadium', lat: 13.736717, lon: 100.523186 },
      status: 'reserved',
      createdAt: new Date().toISOString(),
    }
    existing.unshift(obj)
    localStorage.setItem('demo_reservations', JSON.stringify(existing))
    return obj
  },

  async listReservations() {
    // grpc example (pseudo):
    // if (window.grpcReservationClient) { ... }

    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    return existing
  },

  async cancelReservation(id) {
    // grpc pseudo-code placeholder
    // if (window.grpcReservationClient) { ... }

    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    const idx = existing.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Reservation not found')
    existing[idx].status = 'cancelled'
    existing[idx].cancelledAt = new Date().toISOString()
    localStorage.setItem('demo_reservations', JSON.stringify(existing))
    return existing[idx]
  },

  async checkinReservation(id, userPos) {
    // userPos: { lat, lon }
    // grpc pseudo-code placeholder
    // if (window.grpcReservationClient) { ... }

    const existing = JSON.parse(localStorage.getItem('demo_reservations') || '[]')
    const idx = existing.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Reservation not found')
    const r = existing[idx]
    if (r.status !== 'reserved') {
      throw new Error('Reservation is not in reserved state')
    }

    // check time window: allow check-in from X minutes before to Y minutes after reservation time
    // For demo we'll allow check-in from 30 minutes before to 30 minutes after.
    const resTime = new Date(r.datetime).getTime()
    const now = Date.now()
    const earliest = resTime - 30 * 60 * 1000
    const latest = resTime + 30 * 60 * 1000
    if (now < earliest || now > latest) {
      const err = new Error('Check-in not in allowed time window')
      err.code = 'CHECKIN_TIME_WINDOW'
      throw err
    }

    // check distance
    const dist = metersBetween(userPos.lat, userPos.lon, r.stadium.lat, r.stadium.lon)
    if (dist > CHECKIN_RADIUS_METERS) {
      const err = new Error(`You are too far from stadium (${Math.round(dist)}m). Move within ${CHECKIN_RADIUS_METERS}m to check-in.`)
      err.code = 'CHECKIN_DISTANCE'
      throw err
    }

    existing[idx].status = 'activated'
    existing[idx].checkedInAt = new Date().toISOString()
    localStorage.setItem('demo_reservations', JSON.stringify(existing))
    return existing[idx]
  },

  async checkAvailability(stadiumId, date) {
    // Return a demo availability map. Replace with gRPC call to Availability service.
    // grpc pseudo-code placeholder
    // if (window.grpcAvailabilityClient) { ... }

    // Demo: return a few timeslots as strings
    return [
      { start: `${date}T09:00:00`, durationMinutes: 60 },
      { start: `${date}T10:00:00`, durationMinutes: 60 },
      { start: `${date}T11:00:00`, durationMinutes: 60 },
    ]
  },
}

// ---------------------- Reservation page ----------------------
export default function Reservation() {
  const [form, setForm] = useState({ name: '', phone: '', datetime: '', service: '', stadiumId: '' })
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availability, setAvailability] = useState([])

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const list = await reservationService.listReservations()
      setAppointments(list)
    } catch (e) {
      console.error(e)
      setError('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.datetime) {
      setError('Please provide at least name and datetime')
      return
    }

    try {
      setLoading(true)
      // For demo we attach a stadium object directly. In real app you'd select stadium by id
      const stadium = { id: 'demo-stadium', name: 'Demo Stadium', lat: 13.736717, lon: 100.523186 }
      const created = await reservationService.createReservation({
        name: form.name,
        phone: form.phone,
        datetime: form.datetime,
        service: form.service,
        stadium,
      })
      setAppointments(prev => [created, ...prev])
      setForm({ name: '', phone: '', datetime: '', service: '', stadiumId: '' })
    } catch (e) {
      console.error(e)
      if (e.code === 'TOO_EARLY') setError(e.message)
      else setError('Failed to create reservation')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this reservation?')) return
    try {
      setLoading(true)
      await reservationService.cancelReservation(id)
      await refresh()
    } catch (e) {
      console.error(e)
      setError('Failed to cancel reservation')
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckin(id) {
    setError(null)
    if (!navigator.geolocation) {
      setError('Geolocation is not available in this browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const userPos = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        await reservationService.checkinReservation(id, userPos)
        await refresh()
      } catch (e) {
        console.error(e)
        setError(e.message || 'Check-in failed')
      } finally {
        setLoading(false)
      }
    }, err => {
      console.error(err)
      setError('Could not get location. Permission denied or unavailable.')
      setLoading(false)
    }, { enableHighAccuracy: true, timeout: 15000 })
  }

  async function fetchAvailability() {
    setError(null)
    try {
      const dateOnly = (new Date()).toISOString().slice(0,10)
      const slots = await reservationService.checkAvailability('demo-stadium', dateOnly)
      setAvailability(slots)
    } catch (e) {
      console.error(e)
      setError('Failed to load availability')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Reservation</h1>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <form onSubmit={handleSubmit} style={{ minWidth: 340, maxWidth: 420 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Full name"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="input"
              placeholder="Phone number"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Date & Time</label>
            <input
              value={form.datetime}
              onChange={e => setForm({ ...form, datetime: e.target.value })}
              type="datetime-local"
              className="input"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Service</label>
            <input
              value={form.service}
              onChange={e => setForm({ ...form, service: e.target.value })}
              className="input"
              placeholder="Massage type or notes"
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Saving…' : 'Create Reservation'}
            </button>
            <button type="button" onClick={refresh} style={{ marginLeft: 8 }} className="btn">
              Refresh
            </button>
            <button type="button" onClick={fetchAvailability} style={{ marginLeft: 8 }} className="btn">
              Check Availability
            </button>
          </div>

          {error && (
            <div style={{ color: 'crimson', marginTop: 10 }}>
              {error}
            </div>
          )}

          {availability.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h4>Available slots (demo)</h4>
              <ul>
                {availability.map((s, i) => (
                  <li key={i}>{s.start} — {s.durationMinutes} min</li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <div style={{ flex: 1 }}>
          <h2>Appointments</h2>
          {loading && <div>Loading...</div>}
          {!loading && appointments.length === 0 && <div>No appointments found.</div>}

          <ul style={{ padding: 0, listStyle: 'none' }}>
            {appointments.map(a => (
              <li key={a.id} style={{ marginBottom: 12, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{a.name}</strong> — <em>{a.stadium?.name || 'Unknown stadium'}</em>
                    <div>{a.service}</div>
                    <div style={{ color: '#666' }}>{a.phone}</div>
                    <div style={{ color: '#666' }}>Status: <strong>{a.status}</strong></div>
                  </div>

                  <div style={{ textAlign: 'right', color: '#333' }}>
                    <div>{new Date(a.datetime).toLocaleString()}</div>
                    <div style={{ marginTop: 8 }}>
                      {a.status === 'reserved' && (
                        <>
                          <button onClick={() => handleCheckin(a.id)} className="btn" style={{ marginRight: 8 }}>Check-in</button>
                          <button onClick={() => handleCancel(a.id)} className="btn">Cancel</button>
                        </>
                      )}
                      {a.status === 'activated' && (
                        <div style={{ color: 'green' }}>Checked-in at {a.checkedInAt ? new Date(a.checkedInAt).toLocaleString() : ''}</div>
                      )}
                      {a.status === 'cancelled' && (
                        <div style={{ color: 'gray' }}>Cancelled</div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .input { width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #ccc; }
        .btn { padding: 8px 12px; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer }
        .btn:disabled { opacity: 0.6; cursor: not-allowed }
      `}</style>
    </div>
  )
}
