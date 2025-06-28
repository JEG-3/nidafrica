import React, { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import googleIcon from '../../assets/images/googleIcon.png';
import { IoMdHome } from "react-icons/io";


const SignUp = () => {

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);

    const [formfields, setFormfields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isAdmin: true
    })

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    const onchangeInput = (e) => {
        setFormfields(() => ({
            ...formfields,
            [e.target.name]: e.target.value
        }))
    }

    const signUp = (e) => {
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

            if (formfields.confirmPassword === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Please confirm your password."
                });
                return false;
            }

            if (formfields.confirmPassword !== formfields.password) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Passwords do not match. Please try again!"
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
                        history("/login")
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

    return (
        <>
            <img src={patern} className='loginPatern' />
            <section className="loginSection signUpSection">

                <div className='row'>
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>BEST UX/UI FASHION <span className='text-sky'>E-COMMERCE DASHBOARD</span> & ADMIN PANEL</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</p>

                        <div className='w-100 mt-4'>
                            <Link to={'/'}> <Button className="btn-blue btn-lg btn-big"><IoMdHome /> Go To Home</Button></Link>
                        </div>

                    </div>

                    <div className='col-md-4 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" />
                                <h5 className='font-weight-bold'>Register a new account</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>

                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input type='text' className='form-control' placeholder='enter your name' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="name" onChange={onchangeInput} />
                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input type='text' className='form-control' placeholder='enter your email' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="email" onChange={onchangeInput} />
                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt /></span>
                                        <input type='text' className='form-control' placeholder='enter your phone' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="phone" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='enter your password' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} name="password" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }

                                        </span>

                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='confirm your password' onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} name="confirmPassword" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
                                            {
                                                isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }

                                        </span>

                                    </div>

                                    <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & Condiotions" />

                                    <div className='form-group'>
                                        <Button type="submit" className="btn-blue btn-lg w-100 btn-big">Sign Up</Button>
                                    </div>

                                    <div className='form-group text-center mb-0'>
                                        <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                            <span className='line'></span>
                                            <span className='txt'>or</span>
                                            <span className='line'></span>
                                        </div>

                                        <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                            <img src={googleIcon} width="25px" /> &nbsp; Sign In with Google
                                        </Button>

                                    </div>

                                </form>

                                <span className='text-center d-block mt-3'>
                                    Don't have an account?
                                    <Link to={'/login'} className='link color ml-2'>Sign In</Link>
                                </span>

                            </div>



                        </div>
                    </div>
                </div>


            </section>
        </>
    )

}

export default SignUp;