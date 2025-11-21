import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { PiFlowerLotus } from "react-icons/pi";
import { toast } from 'react-toastify';


function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {user} = useSelector((state)=>state.auth)

    const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    localStorage.removeItem("user");

    toast.success("You have logged out!", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
  });

  navigate("/", { replace: true });  // ⭐ กลับหน้า Home ทันที
};


  return (
    <header className='header'>
      <div className='logo'>
  <Link to='/' className='logo-link'>
    <div className='logo-text'>
      <PiFlowerLotus className='logo-icon' />
      <span>Massage Shop</span>
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
