import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { PiFlowerLotus } from "react-icons/pi";


function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {user} = useSelector((state)=>state.auth)

    const onLogout = () =>{
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

  return (
    <header className='header'>
      <div className='logo'>
  <Link to='/' className='logo-link'>
    <div className='logo-text'>
      <PiFlowerLotus className='logo-icon' />
      <span>Sport Stadium</span>
    </div>
    <p className='logo-subtext'>Home</p>
  </Link>
</div>
      <ul>
        {user?(
            <li>
                <button className='btn' onClick={onLogout}><FaSignOutAlt/> logout</button>
            </li>
        ):(
            <>
             <li>
                <Link to='/login'>
                    <FaSignInAlt /> Login
                </Link>
            </li>
            <li>
                <Link to='/register'>
                    <FaUser /> Register
                </Link>
            </li>
        </>
        )}
      </ul>
    </header>
  )
}

export default Header
