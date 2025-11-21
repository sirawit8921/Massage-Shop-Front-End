import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdAccountCircle } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })

  const { name, email, telephone, password, confirmPassword, role } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message, { position: "top-center" })
    }
    if (isSuccess || user) {
      navigate('/')
    }
    dispatch(reset())
  }, [isError, isSuccess, user, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" })
      return
    }

    const userData = {
      name,
      email,
      telephone,
      password,
      role: "user",
    }

    dispatch(register(userData))
  }

  return (
    <>
      <section className='heading'>
        <h1 style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <MdAccountCircle size={70} /> Create an account
        </h1>
        <p>to start your massage reservation</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              name='name'
              value={name}
              onChange={onChange}
              placeholder='Enter your name'
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              name='telephone'
              value={telephone}
              onChange={onChange}
              placeholder='Enter your phone number'
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              name='password'
              value={password}
              onChange={onChange}
              placeholder='Enter your password'
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              name='confirmPassword'
              value={confirmPassword}
              onChange={onChange}
              placeholder='Confirm your password'
              required
            />
          </div>

          <div className='form-group'>
            <button className='btn btn-block'>Submit</button>
          </div>

        </form>
      </section>
    </>
  )
}

export default Register
