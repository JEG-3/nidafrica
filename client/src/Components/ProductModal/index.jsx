/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Button from '@mui/material/Button'
import { Dialog } from '@mui/material';
import { MdClose } from 'react-icons/md'
import Rating from '@mui/material/Rating'
import { useRef } from 'react';
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import QuantityBox from '../QuantityBox';
import { IoIosHeartEmpty } from 'react-icons/io';
import { MdOutlineCompareArrows } from 'react-icons/md';
import { useContext, useState } from 'react'
import { MyContext } from '../../App'
import citi from '../../assets/images/citi.jpg'
import ProductZoom from '../ProductZoom';

const ProductModal = ( props ) => {

  const [ slideIndex, setSlideIndex ] = useState( 0 );
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  const context = useContext( MyContext );

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    fade: false,
    arrows: true
  }

  var settings2 = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
  }

  return (
    <>
      <Dialog open={ true } className='productModal' onClose={ () => context.setisOpenProductModal( false ) }>
        <Button className='close_' onClick={ () => context.setisOpenProductModal( false ) }><MdClose /></Button>
        <h4 className="mb-1 font-weight-bold">{props?.data?.name}</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-4">
            <span>Brands:</span>
            <span className='ml-2'><b>{props?.data?.brand}</b></span>
          </div>
          <Rating className='mt-2 mb-2' name='read only' value={ props?.data?.rating } readOnly size='large' precision={ 0.5 } />
        </div>

        <hr />

        <div className="row mt-2 ProductDetailModal">
          <div className="col-md-5">
      
              <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />

          </div>
          <div className="col-md-7">
            <div className="d-flex info align-items-center mb-3">
              <span className="oldPrice text-danger lg mr-2">${props?.data?.oldPrice}</span>&nbsp;&nbsp;
              <span className="netPrice lg">${props?.data?.price}</span>
            </div>
            <span className="badge">{props?.data?.countInStock}%</span>

            <p className=' vit ml-1 mt-3'>{props?.data?.description}</p>

            <div className="d-flex align-items-center">
              <QuantityBox />
              <Button className='btn-blue btn-lg btn-big btn-round ml-3'>Add To Cart</Button>
            </div>


            <div className="d-flex align-items-center mt-5 actions">
              <Button className='btn-round btn-sml' variant='outlined'> <IoIosHeartEmpty /> &nbsp; Add To WishList</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button className='btn-round btn-sml ml-3' variant='outlined'> <MdOutlineCompareArrows /> &nbsp; COMPARE</Button>
            </div>

          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductModal;

// `https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg`