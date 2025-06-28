/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from '../../../utils/api';

const Navigation = (props) => {
  const [navData, setNavData] = useState([]);
  const [isOpenSidebarVal, setisOpenSidebarVal] = useState(false);

  useEffect(() => {
    fetchDataFromApi("/api/subCat").then((res) => {
      console.log("API response:", res); // Log the entire API response
      if (res && res.SubCategoryList) {
        setNavData(res.SubCategoryList); // Use the correct property from the API response
        console.log("Nav data", res.SubCategoryList); // Log the correct data
      } else {
        console.error("Nav data is undefined in the response");
      }
    }).catch((error) => {
      console.error("Error fetching nav data:", error);
    });
  }, []); // Add an empty dependency array to run the effect only once

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 navPart1">
            <div className="catWrapper">
              <div className="bttnn">
                <Button
                  className="allCatTab align-items-center"
                  onClick={() => setisOpenSidebarVal(!isOpenSidebarVal)}
                >
                  <span className='icon1 mr-2'><IoIosMenu /></span>
                  <span className='text'>ALL Categories</span>
                  <span className='icon2 ml-2'><FaAngleDown /></span>
                </Button>
              </div>

              <div className={`sidebarNav ${isOpenSidebarVal ? 'open' : ''}`}>
                <ul>
                  <li>
                    <Link to="/cat/1">
                      <Button>
                        Pre Order
                        <FaAngleRight className="ml-auto" />
                      </Button>
                    </Link>
                    <div className="submenu">
                      <Link to="/cat/1"><Button>Fibroids</Button></Link>
                      <Link to="/cat/1"><Button>Eye-Drops</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                      <Link to="/cat/1"><Button>Pregnancy</Button></Link>
                      <Link to="/cat/1"><Button>Hormonal Imbalance</Button></Link>
                      <Link to="/cat/1"><Button>Pelvic</Button></Link>
                      <Link to="/cat/1"><Button>Ear</Button></Link>
                      <Link to="/cat/1"><Button>Lungs</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                    </div>
                  </li>
                  <li><Link to="/cat/1"><Button>Shop</Button></Link></li>
                  <li>
                    <Link to="/cat/1">
                      <Button>
                        Product Viewer
                        <FaAngleRight className="ml-auto" />
                      </Button>
                    </Link>
                    <div className="submenu">
                      <Link to="/cat/1"><Button>Fibroids</Button></Link>
                      <Link to="/cat/1"><Button>Eye-Drops</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                      <Link to="/cat/1"><Button>Fibroids</Button></Link>
                      <Link to="/cat/1"><Button>Eye-Drops</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                    </div>
                  </li>
                  <li><Link to="/cat/1"><Button>Pre Order</Button></Link></li>
                  <li><Link to="/cat/1"><Button>Product Viewer</Button></Link></li>
                  <li><Link to="/cat/1"><Button>Syrups</Button></Link></li>
                  <li>
                    <Link to="/cat/1">
                      <Button>
                        Tablets
                        <FaAngleRight className="ml-auto" />
                      </Button>
                    </Link>
                    <div className="submenu">
                      <Link to="/cat/1"><Button>Fibroids</Button></Link>
                      <Link to="/cat/1"><Button>Eye-Drops</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                      <Link to="/cat/1"><Button>Fibroids</Button></Link>
                      <Link to="/cat/1"><Button>Eye-Drops</Button></Link>
                      <Link to="/cat/1"><Button>Cough</Button></Link>
                    </div>
                  </li>
                  <li><Link to="/cat/1"><Button>Shop</Button></Link></li>
                  <li><Link to="/cat/1"><Button>Product Viewer</Button></Link></li>
                  <li><Link to="/cat/1"><Button>Pre Order</Button></Link></li>
                  <li><Link to="/cat/1"><Button>Product Viewer</Button></Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-10 navPart2 d-flex align-items-center">
            <ul className='list list-inline ml-auto'>
              <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link></li>
              {
                navData.length !== 0 && navData.map((item, index) => {
                  return (
                    <li className='list-inline-item' key={index}><Link to={`/subCat/${item.id}`}><Button>{item?.subCat}</Button></Link></li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;