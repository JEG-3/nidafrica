/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function HomeCat(props) {

    const [catData, setCatData] = useState([]);

    useEffect(() => {
       setCatData(props.catData)
    },[props.catData])

    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="mb-3 hd">BEST SELLERS</h3>
                <Swiper
                    slidesPerView={9}
                    spaceBetween={1}
                    navigation={true}
                    modules={[Navigation]}
                    slidesPerGroup={4}
                    className="mySwiper"
                >
                   {
                        catData?.length !== 0 && catData?.map((cat, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className="item text-center cursor" style={{ 
                                        border: `1px solid ${cat.color || 'transparent'}`, 
                                        boxShadow: `0 8px 16px 0 ${cat.color || 'rgba(9, 8, 8, 0.4)'}` // Increased shadow size and opacity
                                    }}>
                                        <img src={cat.images[0]} alt="" />
                                        <h6>{cat.name}</h6>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </section>
    );
}

export default HomeCat;