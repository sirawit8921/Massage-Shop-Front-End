import { Link } from 'react-router-dom'
import { SlCalender } from 'react-icons/sl'
import { GrFormView } from "react-icons/gr";

function Home() {
  return (
    <>
      <section className='heading'>
        <h1>Sport Stadium</h1>
        <p>Welcome to Sport Stadium Reservation System</p>
      </section>

      <Link to='/new-ticket' className='btn btn-reverse btn-block'>
        <SlCalender /> Create New Appointment
      </Link>

      <Link to='/tickets' className='btn btn-block'>
        <GrFormView size = {25} /> View My Appointments
      </Link>
    </>
  )
}

export default Home
