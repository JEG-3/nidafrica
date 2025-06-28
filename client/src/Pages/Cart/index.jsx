/* eslint-disable no-unused-vars */
import React from 'react';
import img from '../../assets/images/citi.jpg';
import { Link } from 'react-router-dom'
import Rating from '@mui/material/Rating'
import QuantityBox from '../../Components/QuantityBox';
import { IoIosClose } from 'react-icons/io';
import Button from '@mui/material/Button'

const Cart = () => {
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h3 className='echo hd mb-2'>Your Cart</h3>
          <p className='be mt-2'>There are <b className='text-danger'>3</b> products in your cart</p>
          <div className="row">
            <div className="col-md-9 b pr-5">

              <div className="table-responsive">
                <table className='table table-stripe'>
                  <thead>
                    <tr>
                      <th width='35%'>Product</th>
                      <th width='15%'>Unit Price</th>
                      <th width='25%'>Quantity</th>
                      <th width='15%'>Subtotal</th>
                      <th width='10%'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                    <tr>
                      <td width='35%'>
                        <Link to='/product/1'>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={ img } alt="" className='w-100' />
                            </div>

                            <div className="info px-3">
                              <h6>Lorem, ipsum dolor sit amet consectetur</h6>
                              <Rating className='me' name='read-only' value={ 4.5 } readOnly precision={ 0.5 } size='small' />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='15%'>$7.25</td>
                      <td width='25%'>
                        <QuantityBox />
                      </td>
                      <td width='15%'>
                        $7.25
                      </td>
                      <td width='15%'>
                        <span className='remove'><IoIosClose /></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-3 d">
              <div className="card shadow p-3 cartDetails">
                <h4 className='echo'>CART TOTALS</h4>

                <div className="d-flex align-items-center mb-3">
                  <span className='fl'>Subtotal</span>
                  <span className="anchor ml-auto text-danger font-weight-bold">$12.31</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span className='fl'>Shipping</span>
                  <span className="ml-auto"><b className='bi'>Free</b></span>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <span className='fl'>Estimate For</span>
                  <span className="ml-auto"><b className='bi'>United Kingdom</b></span>
                </div>

                <div className="d-flex align-items-center">
                  <span className='fl'>Total</span>
                  <span className="anchor ml-auto text-danger font-weight-bold">$12.31</span>
                </div>

                <br />

                <Button className='aim btn-blue btn-lg btn-big ml-3'>Add To Cart</Button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Cart;
