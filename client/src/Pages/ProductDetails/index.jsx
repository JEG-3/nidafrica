/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ProductZoom from '../../Components/ProductZoom';
import QuantityBox from '../../Components/QuantityBox';
// import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { BsCartFill } from 'react-icons/bs';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineCompareArrows } from 'react-icons/md';
import Tooltip from '@mui/material/Tooltip';
import pr_im from '../../assets/images/the mistre.jpg';
import RelatedProducts from './RelatedProducts';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi, postData } from '../../utils/api';


const ProductDetails = () => {
  const [activeSize, setactiveSize] = useState(null);
  const [activeTabs, setactiveTabs] = useState(0);
  const [value, setValue] = React.useState(2);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProduct] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { id } = useParams();

  const isActive = (index) => {
    setactiveSize(index);
  }


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      console.log("Fetched product data:", res); // Debugging line
      setProductData(res);
      const formData = new FormData();
      formData.append('name', res.name);
      formData.append('description', res.description);
      formData.append('brand', res.brand);
      formData.append('price', res.price);
      formData.append('oldPrice', res.oldPrice);
      formData.append('category', res.category);
      formData.append('subCat', res.subCat);
      formData.append('subCatId', res.subCatId);
      formData.append('countInStock', res.countInStock);
      formData.append('rating', res.rating);
      formData.append('numReviews', res.numReviews);
      formData.append('isFeatured', res.isFeatured);
      formData.append('discount', res.discount);
      formData.append('productRAMS', res.productRAMS);
      formData.append('productSIZE', res.productSIZE);
      formData.append('productWEIGHT', res.productWEIGHT);
      res.images.forEach((image, index) => {
        formData.append('images', image); // Ensure the image file is appended
      });

      postData(`/api/products/recentlyViewed`, formData).then(() => {
        fetchDataFromApi(`/api/products/recentlyViewed`).then((response) => {
          console.log("Fetched recently viewed products:", response.products); // Debugging line
          setRecentlyViewedProduct(response.products); // Ensure response.products is used
        }).catch((error) => {
          console.error("Error fetching recently viewed products:", error);
        });
      }).catch((error) => {
        console.log("Error posting recently viewed product:", error);
      });
      fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`).then((response) => {
        const filteredData = response.products.filter(item => item.id !== id);
        setRelatedProductData(filteredData);
      }).catch((error) => {
        console.error("Error fetching related products:", error);
      });
    }).catch((error) => {
      console.error("Error fetching product details:", error);
    });
  }, [id])




  return (
    <section className="productDetails section">
      <div className="container">
        <div className="row">
          <div className="col-md-4 pl-5 pr-5">
            <ProductZoom images={productData?.images} discount={productData?.discount} />
          </div>
          <div className="stir col-md-7 pl-5">
            <h2 className='hd text-capitalize'>{productData?.name}</h2>
            <ul className="list list-inline d-flex align-items-center">
              <li className="list-inline-item">
                <div className="tel d-flex align-items-center">
                  <span className='text-light mr-2'>Brands:&nbsp;</span>
                  <span className='ter'>{productData?.brand}</span>
                </div>
              </li>

              <li className="list-inline-item">
                <div className='tel d-flex align-items-center'>
                  <Rating name="read-only" value={parseInt(productData?.rating)} precision={0.5} size="large" readOnly />
                  <span className='text-light cursor ml-2'>1 Review</span>
                </div>
              </li>

            </ul>

            <div className="d-flex info mb-2">
              <div className="oldPrice">${productData?.oldPrice}</div>
              <div className="netPrice text-danger ml-3">${productData?.price}</div>
            </div>
            <span className="badge badge-success">IN STOCK</span>
            <p style={{ width: '112%' }} className='tee mt-3'>
              {productData?.description}
            </p>

            {/* {
              productData?.productRAMS?.length !== 0 &&
              <div className="productSize d-flex align-items-center">
                <span>product RAMS:</span>
                <ul className="list-inline-item mb-0 pl-4">
                  {productData?.productRAMS?.map((item, index) => {
                    return (
                      <li key={index} className="list-inline-item">
                        <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            } */}
            {
              productData?.productSIZE?.length !== 0 &&
              <div className="productSize d-flex align-items-center">
                <span>Size / Weight:</span>
                <ul className="list-inline-item mb-0 pl-4">
                  {productData?.productSIZE?.map((item, index) => {
                    return (
                      <li key={index} className="list-inline-item">
                        <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            }

            <div className="d-flex align-items-center mt-5 c">
              <QuantityBox />
              <Button className='btn-blue btn-lg btn-big'><BsCartFill />&nbsp; Add To Cart</Button>
              <Tooltip title="Add To Wishlist" placement='top'>
                <Button className='btn-blue btn-lg btn-big btn-circle ml-4'>
                  <FaRegHeart />
                </Button>
              </Tooltip>
              <Tooltip title="Compare" placement='top'>
                <Button className='btn-blue btn-lg btn-big btn-circle ml-4'>
                  <MdOutlineCompareArrows />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>


        <br />

        <div className="card mt-5 p-5 detailsPageTabs">
          <div className="customTabs">
            <ul className='list list-inline'>
              <li className='list-inline-item'>
                <Button className={`${activeTabs === 0 ? 'active' : ''}`} onClick={() => { setactiveTabs(0) }}>Description</Button>
              </li>
              <li className='list-inline-item'>
                <Button className={`${activeTabs === 1 ? 'active' : ''}`} onClick={() => { setactiveTabs(1) }}>Additional info</Button>
              </li>
              <li className='list-inline-item'>
                <Button className={`${activeTabs === 2 ? 'active' : ''}`} onClick={() => { setactiveTabs(2) }}>Reviews (3)</Button>
              </li>

            </ul>

            <br />

            {
              activeTabs === 0 &&
              <div className="tabContent">
                {productData.description}
              </div>
            }

            {
              activeTabs === 1 &&
              <div className="tabContent">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr className="stand-up">
                        <th>Stand Up</th>
                        <td>
                          <p>35"L x 24"W x 37-45"H(front to back wheel)</p>
                        </td>
                      </tr>

                      <tr className="folded-wo-wheels">
                        <th>Folded (w/o wheels)</th>
                        <td>
                          <p>35"L x 24"W x 37-45"H</p>
                        </td>
                      </tr>

                      <tr className="folded-w-wheels">
                        <th>Folded (w/ wheels)</th>
                        <td>
                          <p>35"L x 24"W x 37-45"H(front to back wheel)</p>
                        </td>
                      </tr>

                      <tr className="door-pass-through">
                        <th>Door Pass Through</th>
                        <td>
                          <p>24</p>
                        </td>
                      </tr>

                      <tr className="frame">
                        <th>Frame</th>
                        <td>
                          <p>Aluminum</p>
                        </td>
                      </tr>

                      <tr className="weight-wo-wheels">
                        <th>Weight (w/o wheels)</th>
                        <td>
                          <p>20 LBS</p>
                        </td>
                      </tr>

                      <tr className="weight-capacity">
                        <th>Weight Capacity</th>
                        <td>
                          <p>60 LBS</p>
                        </td>
                      </tr>

                      <tr className="width">
                        <th>Width</th>
                        <td>
                          <p>24"</p>
                        </td>
                      </tr>

                      <tr className="handle-height-ground-to-handle">
                        <th>Handle height (ground to handle)</th>
                        <td>
                          <p>37-45"</p>
                        </td>
                      </tr>

                      <tr className="wheels">
                        <th>Wheels</th>
                        <td>
                          <p>12" air / wide track slick thread</p>
                        </td>
                      </tr>

                      <tr className="seat-back-height">
                        <th>Seat back height</th>
                        <td>
                          <p>21.5"</p>
                        </td>
                      </tr>

                      <tr className="head-room-inside-canopy">
                        <th>Head room (inside canopy)</th>
                        <td>
                          <p>25"</p>
                        </td>
                      </tr>

                      <tr className="pa_color">
                        <th>Color</th>
                        <td>
                          <p>Black, Blue, Red, White</p>
                        </td>
                      </tr>

                      <tr className="pa_size">
                        <th>Size</th>
                        <td>
                          <p>M, S</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }

            {
              activeTabs === 2 &&

              <div className="tabContent">
                <div className="row">
                  <div className=" col-md-11">
                    <h3 className='echo'>Customer questions & answers</h3>
                    <br />


                    <div className="card p-5 reviewsCard flex-row">
                      <div className="image">
                        <div className="rounded-circle">
                          <img className='goal' src={pr_im} alt="" />
                        </div>
                        <span className='text-g d-block text-center font-weight-bold'>Queen Ijere</span>
                      </div>

                      <div className="info pl-5">
                        <div className="d-flex align-items-center w-100">
                          <h5 className='text-light'>01/03/1980</h5>
                          <div className="ml-auto mla">
                            <Rating name='half-rating-read' value={4.5} precision={0.5} readOnly />
                          </div>
                        </div>
                        <p className='down'>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quisquam.
                          Tempore in exercitationem incidunt omnis magnam consectetur dolores optio quasi enim sequi.
                          Ut dolorum odit a, molestiae voluptate magnam optio!
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quisquam.
                          Tempore in exercitationem incidunt omnis magnam consectetur dolores optio quasi enim sequi.
                          Ut dolorum odit a, molestiae voluptate magnam optio!
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quisquam.
                          Tempore in exercitationem incidunt omnis magnam consectetur dolores optio quasi enim sequi.
                          Ut dolorum odit a, molestiae voluptate magnam optio!
                        </p>
                      </div>
                    </div>
                    <br className='res-hide' />
                    <br className='res-hide' />

                    <form className='reviewForm'>
                      <h4 className='echo'>Add a review</h4> <br />
                      <div className="form-group">
                        <textarea className="form-control" placeholder='Write a Review' name='review'></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input type="text" className="form-control" placeholder='Name' name='userName' />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <Rating
                              name="simple-controlled"
                              value={value}
                              onChange={(event, newValue) => {
                                setValue(newValue);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <br />

                      <div className="form-group">
                        <Button type='submit' className='btn-g btn-lg btn-purple'>Submit Review</Button>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-7 pl-5 reviewBox">
                    <h4 className='echo'>Customer reviews</h4>

                    <div className="d-flex align-items-center mt-2">
                      <Rating name='half-rating-read' defaultValue={4.8} precision={0.5} readOnly />&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>4.8 out of 5</strong>
                    </div>

                    <br />

                    <div className="progressBarBox d-flex align-items-center">
                      <span className="mr-3">5 star</span>
                      <div className="progress" style={{ width: '88%', height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '75%', height: '20px' }}>75%</div>
                      </div>
                    </div>

                    <div className="progressBarBox d-flex align-items-center">
                      <span className="mr-3">4 star</span>
                      <div className="progress" style={{ width: '88%', height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '50%', height: '20px' }}>50%</div>
                      </div>
                    </div>

                    <div className="progressBarBox d-flex align-items-center">
                      <span className="mr-3">3 star</span>
                      <div className="progress" style={{ width: '88%', height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '55%', height: '20px' }}>55%</div>
                      </div>
                    </div>

                    <div className="progressBarBox d-flex align-items-center">
                      <span className="mr-3">2 star</span>
                      <div className="progress" style={{ width: '88%', height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '35%', height: '20px' }}>35%</div>
                      </div>
                    </div>


                    <div className="progressBarBox d-flex align-items-center">
                      <span className="mr-3">1 star</span>
                      <div className="progress" style={{ width: '88%', height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '25%', height: '20px' }}>25%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }


          </div>
        </div>

        <br />

        {
          relatedProductData?.length !== 0 && <RelatedProducts title='RELATED PRODUCTS' data={relatedProductData} />
        }

        {
          recentlyViewedProducts?.length !== 0 && <RelatedProducts title='RECENTLY VIEWED PRODUCTS' data={recentlyViewedProducts} />
        }

      </div>
    </section >
  )
}

export default ProductDetails;