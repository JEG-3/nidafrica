/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import SideBar from '../../Components/SideBar';
import slide_image_8 from '../../assets/images/slideBanner1.jpg';
import Button from '@mui/material/Button';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { TbGridDots } from 'react-icons/tb';
// import { PiDotsSixBold } from "react-icons/pi";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from 'react-icons/fa6';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItem from '../../Components/ProductItem';
import { fetchDataFromApi } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { colors } from '@mui/material';

import { useParams } from 'react-router-dom';

const Listing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState('four');
  const [productData, setProductData] = useState([]);
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const { id } = useParams();

  useEffect(() => {
    fetchDataFromApi(`/api/products?subCatId=${id}`).then((res) => {
      setProductData(res.products);
    })
  }, [id]);

  const filterData = (subCatId) => {
    fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res) => {
      setProductData(res.products);
    })
  }

  const filterByRating = (rating) => {
    fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${id}`).then((res) => {
      setProductData(res.products);
    });
  }

  // const filterByRating=(rating) => {
  //   alert(rating)
  // }

  // const filterByPrice = (price,subCatId) => {
  //   fetchDataFromApi(`/api/products?minPrice=${price[0]&maxPrice=${price[1]}&subCatId=${subCatId}}`).then((res) => {
  //     setProductData(res.products);
  //   })
  // }

  return (
    <>
      <section className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <SideBar filterData={filterData} filterByRating={filterByRating} />

            <div className="content_right">
              <img src={slide_image_8} alt="" className="w-100" />

              <div className="showBy mt-3 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button className={productView === 'one' ? 'act' : ''} onClick={() => setProductView('one')}><IoIosMenu /></Button>
                  {/* <Button onClick={()=>setProductView('two')}><HiViewGrid /></Button> */}
                  <Button className={productView === 'three' ? 'act' : ''} onClick={() => setProductView('three')}><CgMenuGridR /></Button>
                  <Button className={productView === 'four' ? 'act' : ''} onClick={() => setProductView('four')}><TfiLayoutGrid4Alt /></Button>
                </div>

                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>Show 12<FaAngleDown /></Button>
                  <Menu
                    className="w-100 showPerPageDropdown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>Show 10</MenuItem>
                    <MenuItem onClick={handleClose}>Show 8</MenuItem>
                    <MenuItem onClick={handleClose}>Show 6</MenuItem>
                    <MenuItem onClick={handleClose}>Show 4</MenuItem>
                    <MenuItem onClick={handleClose}>Show 2</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className={`productListing ${productView}`}>
                {
                  productData?.map((item, index) => {
                    return (
                      <ProductItem key={index} itemView={productView} productData={item} item={item} />
                    )
                  })
                }
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination count={10} color="secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;