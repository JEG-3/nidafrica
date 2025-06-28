/* eslint-disable no-unused-vars */
import React from 'react';
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import { useState, useEffect } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link, useParams } from 'react-router-dom';
import logosi from '../../assets/images/ban.gif'
import { fetchDataFromApi } from '../../utils/api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Rating from '@mui/material/Rating';
import { useContext } from 'react';
import { MyContext } from '../../App';


const SideBar = (props) => {

  const [value, setValue] = useState([100, 60000]);

  const [value2, setValue2] = useState(0);

  const [navData, setNavData] = useState([]);

  const [subCatId, setSubCatId] = useState('');

  const [filterSubCat, setfilterSubCat] = React.useState();

  const context = useContext(MyContext);

  const { id } = useParams();

  useEffect(() => {
    setSubCatId(id)
  }, { id })

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


  const handleChange = (event) => {
    setfilterSubCat(event.target.value);
    props.filterData(event.target.value);
    setSubCatId(event.target.value);
  };

  // const handleRatingChange = (newValue) => {
  //   filterByRating(newValue);
  // };

  const filterByRating = (rating) => {
    props.filterByRating(rating, subCatId);
  }

  return (

    <>
      <div className="sidebar">
        <div className="sticky">
          <div className="filterBox">
            <h6>PRODUCT CATEGORIES</h6>

            <div className="scroll">
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={filterSubCat}
                onChange={handleChange}
              >
                {
                  navData?.length !== 0 && navData?.map((item, index) => {
                    return (
                      <FormControlLabel value={item?.id} control={<Radio />} label={item?.subCat} />
                    )
                  })
                }

              </RadioGroup>

            </div>
          </div>

          <div className="filterBox">
            <h6>FILTER BY RATING</h6>

            <div className="scroll pl-0">
                <ul>
                <li onClick={() => filterByRating(5)}>
                  <Rating name="read-only" value={5} size="small" readOnly />
                </li>
                <li onClick={() => filterByRating(4)}>
                  <Rating name="read-only" value={4} size="small" readOnly />
                </li>
                <li onClick={() => filterByRating(3)}>
                  <Rating name="read-only" value={3} size="small" readOnly />
                </li>
                <li onClick={() => filterByRating(2)}>
                  <Rating name="read-only" value={2} size="small" readOnly />
                </li>
                <li onClick={() => filterByRating(1)}>
                  <Rating name="read-only" value={1} size="small" readOnly />
                </li>
                </ul>
            </div>
          </div>

          <Link to="#">
            <img src={logosi} alt='logosi' className='w-100' style={{ borderRadius: '8px' }} />
          </Link>

        </div>
      </div>

    </>

  )
}

export default SideBar;