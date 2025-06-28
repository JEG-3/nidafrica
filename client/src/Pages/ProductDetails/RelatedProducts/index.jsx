/* eslint-disable no-unused-vars */
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItem from '../../../Components/ProductItem'

// Set default value for props.data to an empty array
const RelatedProducts = ({ title, data = [] }) => {
  return (
    <>
      <div className="d-flex align-items-center mt-3">
        <div className="info w-75">
          <h3 className='mb-0 hd'>{title}</h3>
        </div>
      </div>

      <br />

      <Swiper
        slidesPerView={6}
        spaceBetween={10}
        navigation={true}
        slidesPerGroup={3}
        modules={[Navigation]}
        className="mySwiper"
      >
        <div className="product_row w-100 mt-4 d-flex">
          {
            Array.isArray(data) && data.length !== 0 && data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <ProductItem item={item} />
                </SwiperSlide>
              )
            })
          }
        </div>
      </Swiper>
    </>
  )
}

export default RelatedProducts;
