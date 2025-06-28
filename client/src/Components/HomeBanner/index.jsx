/* eslint-disable no-unused-vars */
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaRegUser } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa6'
import { FaAngleLeft } from 'react-icons/fa6'
import Slider from "react-slick";


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import slide_image from '../../assets/images/slideBanner1.jpg';
// import slide_image_2 from '../../assets/images/imgbg.jpg';
// import slide_image_3 from '../../assets/images/th (24).jpg';
// import slide_image_4 from '../../assets/images/imgbg.jpg';
// import slide_image_5 from '../../assets/images/imgbg.jpg';
// import slide_image_6 from '../../assets/images/imgbg.jpg';
// import slide_image_7 from '../../assets/images/imgbg.jpg';
// import slide_image_8 from '../../assets/images/imgbg.jpg';
import { Link } from 'react-router-dom';

const HomeBanner = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    autoplay: true,
    slidesToScroll: 1,
    spaceBetween:15,
  };
  return (
    <div className="container">
          <div className="homeBannerSection">
      <div className="open">
        <div className="containerr">
          <div className='headinger'>
          <Link to='/cat/1'>
          <Slider {...settings}>
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
              <img src={slide_image} alt="" />
          </Slider></Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomeBanner;