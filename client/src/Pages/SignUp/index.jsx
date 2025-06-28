/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../App';
import logo from '../../assets/images/logo-leaf.jpg';
import Gicon from '../../assets/images/Gicon.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';

const SignUp = () => {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false
  })

  const history = useNavigate();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);
  
  const [phone, setPhone] = useState('');
  
  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value
    }))
  }

  const register = (e) => {
    console.log(formfields)
    e.preventDefault();

    try {
      if (formfields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "please add a name"
        })
        return false;
      }

      if (formfields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Please enter your email address."
        });
        return false;
      }

      if (formfields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Please enter your phone number."
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

      postData("/api/user/signup", formfields).then((res) => {
        console.log(res)
        if (res.error !== true) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "SignUp Successfully",
          });

          setTimeout(() => {
            history("/signIn")
            // window.location.href="/signIn";
          }, 2000)
        }
        else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          });
        }

      })
    } catch (error) {
      console.log(error)
    }
  }

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9\s()+\-\.]{0,20}$/; // Regex for phone numbers (allowing spaces, parentheses, plus, minus, dot)
    if (regex.test(value)) {
      setPhone(value);
    }
  };
  return (
    <section className="section signInPage signUpPage">
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
          <form className='mt-2' onSubmit={register}>
            <h2 className='mb-3'>Sign Up</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField label='Name' name='name' onChange={onchangeInput} type='text' required variant='standard' className='w-100' />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label='Phone No.' name='phone' onChange={onchangeInput} type='tel' required variant='standard' className='w-100'
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <TextField id='standard-basic' label='Email' type='email' name='email' onChange={onchangeInput} required variant='standard' className='w-100' />
            </div>
            <div className="form-group">
              <TextField id='standard-basic' label='Password' type='password' name='password' onChange={onchangeInput} required variant='standard' className='w-100' />
            </div>

            <a className='border-effect cursor txt'>
              Forgot Password?
            </a>

            <div className='d-flex align-items-center mt-3 mb-3'>
              <div className="row w-100">
                <div className="col-md-6">
                  <Button type='submit' className='btn-blue w-100 btn-big btn-lg txt'>Sign Up</Button>

                </div>
                <div className="col-md-6 pr-0">
                  <Link to='/' className='d-block w-100'><Button className='btn-big btn-lg w-100'
                    variant='outlined' style={{ marginLeft: '12px', fontSize: '13px', color: 'rgb(255 255 255 / 60%)' }}
                    onClick={() => context.setisHeaderFooterShow(true)}>Cancel</Button></Link>
                </div>
              </div>
            </div>

            <p className='txt'>Already Registered?&nbsp;&nbsp;<Link to='/signIn' className='border-effect txx'>Sign In</Link></p>

            <h6 className='mt-4 text-center font-weight-bold'>Or continue with a social account</h6>

            <Button className='loginWithGoogle mt-3' variant='outlined'><img src={Gicon} alt="" />Sign In with Google</Button>

          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUp;