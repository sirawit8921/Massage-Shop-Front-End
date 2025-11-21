import { Link } from 'react-router-dom'
import { SlCalender } from 'react-icons/sl'
import { GrFormView } from "react-icons/gr";

function Home() {
  return (
    <>
      <section className='heading'>
        <h1>Massage Shop</h1>
        <p>Welcome to Massage Shop Reservation System</p>
      </section>

      {/*Protected: Create Appointment */}
      <Link to='/create-appointment' className='btn btn-reverse btn-block'>
        <SlCalender /> Create New Appointment
      </Link>

      {/*Protected: View Appointments */}
      <Link to='/my-appointments' className='btn btn-block'>
        <GrFormView size={25} /> View My Appointments
      </Link>
    </>
  )
}

export default Home
