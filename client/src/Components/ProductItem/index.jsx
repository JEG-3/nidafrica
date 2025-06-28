/* eslint-disable no-unused-vars */
import React,{useEffect, useRef} from 'react'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import { AiOutlineFullscreen } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext, useState } from 'react'
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const ProductItem = (props) => {
  const context = useContext( MyContext );
  
  const viewProductDetails = ( id ) => {
    context.setisOpenProductModal( {
      id:id,
      open:true
    } );
  }
  
  const [isHovered, setIsHovered] = useState(false);

  const sliderRef = useRef();


  var settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 700,
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <>
    
    <div>
        <div className={`productItem ${props.itemView}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
          <div className="imgWrapper">
          <Link to={`/product/${props.item?.id}`}>   
          {
            isHovered === true ?
            <Slider {...settings} ref={sliderRef}>
             {
              props.item?.images?.map((image, index) => {
                return(
                  <div className="slick-slide" key={index}>
                    <img src={image} className='w-100' alt="" />
                    </div>
                  
                )
              })
             }
            </Slider>

            :
            
            <img src={props.item?.images[0]} className='w-100' alt="" />
          }
            </Link>
            <span className="badge badge-secondary">{props.item?.discount}%</span>

            <div className="actions">
              <Button onClick={ () => viewProductDetails( props.item?.id ) }><AiOutlineFullscreen /></Button>
              <Button><IoMdHeartEmpty className='aghr' style={ { fontSize: '18px' } } /></Button>
            </div>

          </div>
          <div className="info">
            <h4>{props.item?.name}</h4>
            <span className="d-block a">{props.item?.countInStock}</span>
            <Rating className='mt-2 mb-2' name='read only' value={ props.item?.rating } readOnly size='large' precision={ 0.5 } />

            <div className="d-flex">
              <span className='oldPrice text-danger'>${ props.item?.oldPrice }</span>
              &nbsp;&nbsp;&nbsp; <span className='netPrice ml-3'>${props.item?.price}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductItem;