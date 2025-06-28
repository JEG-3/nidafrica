/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import logosi from '../../assets/images/logosi.jpg'
import { Link } from 'react-router-dom'
import { FaAngleDown } from "react-icons/fa6"
import CountryDropdown from '../CountryDropdown'
import { IoSearch } from 'react-icons/io5'
import Button from '@mui/material/Button'
import { FaRegUser } from 'react-icons/fa'
import { AiOutlineFullscreen } from "react-icons/ai";
import SearchBox from './search Box'
import Navigation from './Navigation'
import { MyContext } from '../../App'
import { IoBagOutline } from 'react-icons/io5'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { FaClipboardCheck } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'

const Header = () => {

  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const logout = () => {
    setAnchorEl(null);
    localStorage.clear();
    context.setIsLogin(false);
  };

  return (
    <>
      <div className='headerWrapper' >
        <div className="top-strip bg-purple">
          <div className='container'>
            <p className='mt-0 mb-0 text-center'> Due to the <b>Economic Hardships</b>, There might be a slight delay in order processing</p>
            {/* <p className='mt-0 mb-0 text-center'><marquee> Due to the <b>Economic Hardships</b>, There might be a slight delay in order processing</marquee></p> */}
          </div>
        </div>

        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper  d-flex align-items-center col-sm-2">
                <Link to={'/'}> <img src={logosi} alt="logosi" /> </Link>
              </div>

              <div className='col-sm-10 d-flex align-items-center part2'>
                {
                  context.countryList.length !== 0 && <CountryDropdown />
                }

                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <SearchBox />


                <div className="part3 d-flex align-items-center ml-auto">
                  {
                    context.isLogin !== true ? <Link to='/signIn'><Button
                      className='btn-blue mr-3'>Sign In</Button></Link> :
                      <>
                      <Button onClick={handleClick} className='circle mr-3'> <FaRegUser /> </Button>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={handleClose}>
                          <Avatar /> My account
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <FaClipboardCheck fontSize="small" />
                          </ListItemIcon>
                          Orders
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <FaHeart fontSize="small" />
                          </ListItemIcon>
                          My List
                        </MenuItem>
                        <MenuItem onClick={logout}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                      </>
                  }
                  <div className="ml-auto cartTab d-flex align-items-center">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="fr price">3.29$</span>
                    &nbsp;&nbsp;
                    <div className="position-relative ml-2">
                      <Link to='/cart/1'>
                        <Button className='circle'> <IoBagOutline /> </Button>
                        <span className="count d-flex align-items-center justify-content-center">1</span></Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </header>

        <Navigation />

      </div>
    </>
  )
}

export default Header