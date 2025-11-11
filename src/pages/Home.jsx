import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SlCalender } from 'react-icons/sl'
import { GrFormView } from "react-icons/gr"
import { toast } from 'react-toastify'

function Home() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleCreateAppointment = () => {
    if (!user) {
      // ⚠️ ถ้ายังไม่ได้ login
      toast.warning('⚠️ Please login first to create an appointment', {
        position: 'top-center',
        autoClose: 2000,
      })
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    // ✅ ถ้า login แล้ว ไปหน้า /new-ticket
    navigate('/new-ticket')
  }

  const handleViewAppointments = () => {
    if (!user) {
      toast.warning('⚠️ Please login first to view your appointments', {
        position: 'top-center',
        autoClose: 2000,
      })
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    navigate('/tickets')
  }

  return (
    <>
      <section className='heading'>
        <h1>Sport Stadium</h1>
        <p>Welcome to Sport Stadium Reservation System</p>
      </section>

      {/* ✅ ปุ่ม Create */}
      <button onClick={handleCreateAppointment} className='btn btn-reverse btn-block'>
        <SlCalender /> Create New Appointment
      </button>

      {/* ✅ ปุ่ม View */}
      <button onClick={handleViewAppointments} className='btn btn-block'>
        <GrFormView size={25} /> View My Appointments
      </button>
    </>
  )
}

export default Home
