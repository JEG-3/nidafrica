/* eslint-disable no-unused-vars */
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/Products/addProduct"; // Ensure this path is correct
import EditProduct from "./pages/Products/editProduct"; // Ensure this path is correct
import CategoryAdd from "./pages/Category/addCategory";
import Category from "./pages/Category/categoryList"; // Ensure this path is correct
import Snackbar from '@mui/material/Snackbar'; // Assuming you're using Material-UI
import Alert from '@mui/material/Alert'; // Assuming you're using Material-UI
import LoadingBar from "react-top-loading-bar";
import EditCategory from "./pages/Category/editCategory";
import { fetchDataFromApi } from "./utils/api";
import EditSubCategory from "./pages/Category/editSubCat"; // Ensure this path is correct

import SubCatAdd from "./pages/Category/addSubCat";
import SubCatList from "./pages/Category/subCategoryList"; // Corrected path

export const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000/")
  const [user, setUser] = useState({
    name:"",
    email:"",
    userId:""
  });

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const [progress, setProgress] = useState(0);

  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({
      open: false,
    }); // Close the Snackbar
  };

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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  useEffect(() => {
    setProgress(20);
    fetchCategory();
    fetchSubCategory();
  }, []);

  const fetchCategory = () => {
    fetchDataFromApi('/api/category').then((res) => {
        setCatData(res);
        setProgress(100);
    })
}
  const fetchSubCategory = () => {
    fetchDataFromApi('/api/subCat').then((res) => {
      setSubCatData(res);
      setProgress(100);
    })
  }

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    subCatData,
    fetchSubCategory,
    setUser,
    user
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className='topLoadingBar'
        />
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

        {isHideSidebarAndHeader !== true && <Header />}

        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div className={`sidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
              <div
                className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : ""} ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          <div className={`content ${isHideSidebarAndHeader === true && "full"} ${isToggleSidebar === true ? "toggle" : ""}`}>
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signUp" exact element={<SignUp />} />
              <Route path="/products" exact element={<Products />} />
              <Route path="/product/details" exact element={<ProductDetails />} />
              <Route path="/product/upload" exact element={<ProductUpload />} />
              <Route path="/product/edit/:id" exact element={<EditProduct />} />
              <Route path="/category" exact element={<Category />} /> {/* Ensure this route is correct */}
              <Route path="/category/add" exact element={<CategoryAdd />} />
              <Route path="/category/edit/:id" exact element={<EditCategory />} />
              <Route path="/subCategory/" exact element={<SubCatList />} />
              <Route path="/subCategory/add" exact element={<SubCatAdd />} />
              <Route path="/subCategory/edit/:id" exact element={<EditSubCategory />} />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;