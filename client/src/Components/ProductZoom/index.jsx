/* eslint-disable no-unused-vars */
import React from 'react';
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import Slider from 'react-slick';
import citi from '../../assets/images/citi.jpg'
import { useState } from 'react'
import { useRef } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const ProductZoom = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

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

  const goto = (index) => {
    setSlideIndex(index);
    zoomSlider.current.swiper.slideTo(index);
    zoomSliderBig.current.slickGoTo(index);
  }

  return (
    <div className="productZoom">
      <div className="productZoom productZoomBig position-relative">
        <div className="badge badge-secondary">{props?.discount}% &nbsp;| hover to view product</div>
        <Slider
          {...settings2}
          className='zoomSliderBig'
          ref={zoomSliderBig}>
          {
            props?.images?.map((item, index) => {
              return (
                <div className="item" key={index}>
                  <InnerImageZoom
                    zoomType="hover"
                    zoomScale={1}
                    src={item} />
                </div>
              )
            })
          }
          <div className="item">
            <InnerImageZoom
              zoomType="hover"
              zoomScale={2}
              src={citi} />
          </div>
        </Slider>
      </div>


      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        navigation={true}
        slidesPerGroup={1}
        modules={[Navigation]}
        className='zoomSlider'
        ref={zoomSlider}>
        {
          props?.images?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className={`item ${slideIndex === index && 'item_active'}`} key={index}>
                  <img src={item} className='w-100' onClick={() => goto(index)} />
                </div>
              </SwiperSlide>
            )
          })
        }
      </Swiper>

    </div>
  )
}

export default ProductZoom;
