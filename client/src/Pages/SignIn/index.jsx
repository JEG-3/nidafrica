/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../App'
import logo from '../../assets/images/logo-leaf.jpg'
import Gicon from '../../assets/images/Gicon.png'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { postData } from '../../utils/api';
import { FaFacebookF } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';


const SignIn = () => {

  const context = useContext(MyContext);
  const history = useNavigate();
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [])

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  })

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value
    }))
  }

  const login = (e) => {
    e.preventDefault();

    if (formfields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter your email address."
      });
      return false;
    }

    if (formfields.password === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter your password."
      });
      return false;
    }

    postData("/api/user/signin", formfields).then((res) => {
      try {

        if (res.error !== false) {
          localStorage.setItem("token", res.token);

          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id
          }
          localStorage.setItem("user", JSON.stringify(user));

          context.setAlertBox({
            open: true,
            error: false,
            msg: "Login Successfully",
          })

          setTimeout(() => {
            window.location.href = "/"
          }, 2000)
        }
        else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          })
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        <svg fill="#fff" id="Layer_1" x="0px" y="0px"
          viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8;' }}>
          <path class="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4
            c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z">
          </path>
        </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={logo} />
          </div>
          <form className='mt-0' onSubmit={login}>
            <h2 className='mb-4'>Sign In</h2>
            <div className="form-group">
              <TextField id='standard-basic' label='Email' type='email' required variant='standard' className='w-100' name="email" onChange={onchangeInput} />
            </div>
            <div className="form-group">
              <TextField id='standard-basic' label='Password' type='password' required variant='standard' className='w-100' name="password" onChange={onchangeInput} />
            </div>

            <a className='border-effect cursor txt'>
              Forgot Password?
            </a>

            <div className='d-flex align-items-center mt-3 mb-3'>
              <Button className='btn-blue col btn-big btn-lg txt' type='submit'>Sign In</Button>
              <Link to='/' ><Button className='btn-big btn-lg col ml-3'
                variant='outlined' style={{ marginLeft: '12px', fontSize: '13px', color: 'rgb(255 255 255 / 60%)' }}
                onClick={() => context.setisHeaderFooterShow(true)}>Cancel</Button></Link>
            </div>

            <p className='txt'>Not Registered?&nbsp;&nbsp;<Link to='/signUp' className='border-effect txx'>Sign Up</Link></p>

            <h6 className='mt-4 text-center font-weight-bold'>Or continue with a social account</h6>

            <Button className='loginWithGoogle mt-3' variant='outlined'><img src={Gicon} alt="" />Sign In with Google</Button>

          </form>
        </div>
      </div>
    </section>
  )
}

export default SignIn;