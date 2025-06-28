/* eslint-disable no-unused-vars */
import React, { useEffect, useContext, useState } from 'react'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import HomeBanner from '../../Components/HomeBanner'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { IoMailOutline } from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { fetchDataFromApi } from '../../utils/api';
import ProductItem from '../../Components/ProductItem'
import HomeCat from '../../Components/homeCat'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MyContext } from '../../App'; // Corrected import path


const Home = () => {
  const context = useContext(MyContext);
  const [catData, setCatData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const selectCat = (cat) => {
    console.log("Selected Category:", cat); // Debugging line
    setSelectedCat(cat);
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    setSelectedCat(context.categoryData[0]?.name);
  
    fetchDataFromApi("/api/category/").then((res) => {
      console.log("Category Data:", res);
      setCatData(res.categoryList);
    });
  
    fetchDataFromApi("/api/products?perPage=6").then((res) => {
      console.log("Products Data:", res);
      setProductsData(res);
    });
  
  }, [context.categoryData]);
  
  useEffect(() => {
    fetchDataFromApi(`/api/products?catName=${selectedCat}`).then((res) => {
      setFilterData(res.products);
      console.log(res)
    });
  }, [selectedCat]);


  return (
    <>
      <HomeBanner />
      {
        catData?.length !== 0 && <HomeCat catData={catData} />
      }
      <section className="homeProducts">
        <div className="container">
          <div className="row">

            <div className="col-md-3">

              <div className="sticky">
                <div className="banner">
                  <img src="src/assets/images/bans.jpg" alt="" className="cursor" />
                </div>

                <div className="banner mt-5">
                  <img src="src/assets/images/banza.jpg" alt="" className="cursor" />
                </div>
              </div>

            </div>

            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center">
                <div className="info w-75">
                  <h3 className='mb-0 hd'>Featured Products</h3>
                  <p className='text-light text-sml mb-0'>Do not miss the current offers until the end of July</p>
                </div>
                <div className="ml-auto" style={{ padding: '10px', width: '100%', minHeight: '50px' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    style={{ width: '100%', minHeight: '50px', color: 'white' }}
                    className="filterTabs"
                  >
                    {
                      context.categoryData?.map((item, index) => {
                        return (
                          <Tab
                            onClick={() => selectCat(item.name)}
                            label={item.name}
                            className="item"
                            style={{ minWidth: '50px', color: 'white' }} />
                        )
                      })
                    }
                  </Tabs>
                </div>
              </div>


              <Swiper
                slidesPerView={4}
                spaceBetween={15}
                pagination={{
                  clickable: true,
                }}
                modules={[Navigation]}
                className="mySwiper mt-4"
              >
                <div className="product_row w-100 mt-4 d-flex">
                  {
                    filterData?.length !== 0 && filterData?.slice(0)?.reverse()?.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ProductItem item={item} />
                        </SwiperSlide>
                      )
                    })
                  }
                </div>
              </Swiper>

              <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                  <h3 className='mb-0 hd'>NEW PRODUCTS</h3>
                  <p className='text-light text-sml mb-0'>Fresh Products</p>
                </div>
                <Button className='viewAllBtn ml-auto'>View All <IoIosArrowRoundForward /> </Button>
              </div>

              <div className="product_row productRow2 w-100 mt-4 d-flex">
                {
                  productsData?.products?.length !== 0 && productsData?.products?.map((item, index) => {
                    return (
                      <ProductItem key={index} item={item} />
                    )
                  })
                }
              </div>

              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner">
                  <img src="src/assets/images/banner3.jpg" alt="" className="cursor w-100" />
                </div>
                <div className="banner">
                  <img src="src/assets/images/banner4.jpg" alt="" className="cursor w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">

            <div className="col-md-6">
              <p className="text-white mb-0">$20 discount for your first order</p>
              <h3 className="text-white">Join our newsletter and get...</h3>
              <p className="text-light">Join our email subscriptions now to get updates <br /> on promotions and coupons.</p>


              <form>
                <IoMailOutline />
                <input type="text" placeholder="Your Email Address" />
                <Button>Subscribe</Button>
              </form>


            </div>

            <div className="col-md-6">
              <img src="src/assets/images/discount.jpg" alt="" />
            </div>

          </div>
        </div>
      </section>



    </>
  )
}

export default Home;