import React, { useContext, useState } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App'; // Adjust the path to your context file
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";


// Breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddSubCat = () => {
  const [categoryVal, setCategoryVal] = useState('');
  const [formFields, setFormFields] = useState({
    category: '',
    subCat: '',
  });
  const history = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);

  const handleChangeCategory = (event) => {
    setCategoryVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      category: event.target.value
    }));
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value
    }));
  };

  const addSubCat = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('category', formFields.category);
    formData.append('subCat', formFields.subCat);

    if (formFields.category === "") {
      setIsLoading(false);
      context.setAlertBox({
        open: true,
        color: 'error',
        msg: 'Please select a category'
      });
      return false;
    }

    if (formFields.subCat === "") {
      setIsLoading(false);
      context.setAlertBox({
        open: true,
        color: 'error',
        msg: 'Please pick a sub category'
      });
      return false;
    }

    postData('/api/subCat/create', formFields).then(res => {
      setIsLoading(false);
      history('/category');
    });

  }
  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 res-col">
        <h5 className="mb-0">Edit Product</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Dashboard"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb
            component="a"
            label="Category"
            href="#"
            deleteIcon={<ExpandMoreIcon />}
          />
          <StyledBreadcrumb
            label="SubCat"
            deleteIcon={<ExpandMoreIcon />}
          />
        </Breadcrumbs>
      </div>
      <form className='form' onSubmit={addSubCat}>
        <div className='row'>
          <div className='col-sm-9'>
            <div className='card p-4 mt-0'>
              <div className='card p-4 mt-0'>
                <div className='col'>
                  <div className='form-group'>
                    <h6>CATEGORY</h6>
                    <Select
                      value={categoryVal}
                      onChange={handleChangeCategory}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      className='w-100'
                      name="category"
                    >
                      <MenuItem value="">
                        <em value={null}>None</em>
                      </MenuItem>

                      {
                        context.catData?.categoryList?.length !== 0 &&
                        context.catData?.categoryList?.map((cat, index) => {
                          return (
                            <MenuItem className="text-capitalize" value={cat.id} key={index}>{cat.name}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </div>
                </div>
                <div className='col'>
                  <div className='form-group'>
                    <h6>SUB CATEGORY</h6>
                    <input type='text' name="subCat" value={formFields.subCat} onChange={inputChange} />
                  </div>
                </div>
              </div>
              <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddSubCat;
