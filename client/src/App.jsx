/* eslint-disable no-unused-vars */
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css"
import Home from './Pages/Home'
import Listing from './Pages/Listing'
import Header from './Components/Header'
import React from 'react'
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from './Components/Footer'
import ProductModal from './Components/ProductModal'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import { fetchDataFromApi } from './utils/api';
import Snackbar from '@mui/material/Snackbar'; // Assuming you're using Material-UI
import Alert from '@mui/material/Alert';

const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [isOpenProductModal, setisOpenProductModal] = useState({
    id: '',
    open: false
  });
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });
  
    const [user, setUser] = useState({
      name:"",
      email:"",
      userId:""
  });

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res.categoryList); // Set categoryData to the categoryList array
    });

    fetchDataFromApi("/api/subCat").then((res) => {
      setSubCategoryData(res.setSubCategoryData)
    })
  }, []);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token!=="null" && token!==undefined && token!==null){
        setIsLogin(true)
  
        const userData = JSON.parse(localStorage.getItem("user"));
  
        setUser(userData)
      }else{
        setIsLogin(false);
      }
    }, [isLogin]);
  
  useEffect(() => {
    isOpenProductModal.open === true &&
      fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
        setProductData(res)
      })
  }, [isOpenProductModal]);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data)
      console.log(res.data.data);
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({
      open: false,
    }); // Close the Snackbar
  };

  const values = {
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,
    alertBox,
    setAlertBox,
  }


  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {
          isHeaderFooterShow === true && <Header />
        }

        <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/subCat/:id" exact={true} element={<Listing />} />
          <Route path="/product/:id" exact={true} element={<ProductDetails />} />
          <Route path="/cart/:id" exact={true} element={<Cart />} />
          <Route path="/signIn" exact={true} element={<SignIn />} />
          <Route path="/signUp" exact={true} element={<SignUp />} />
        </Routes>
        {
          isHeaderFooterShow === true && <Footer />
        }

        {
          isOpenProductModal.open === true && <ProductModal data={productData} />
        }
      </MyContext.Provider>
    </BrowserRouter>
  )
}

export default App
export { MyContext }