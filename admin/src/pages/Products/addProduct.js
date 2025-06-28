import React, { useRef, useEffect, useContext, useState } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import Button from '@mui/material/Button';
import { fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App'; // Adjust the path to your context file
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ProductUpload = () => {
    const [categoryVal, setCategoryVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [productRams, setProductRAMS] = useState('');
    const [productWeight, setProductWeight] = useState('');
    const [productSize, setProductSize] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);
    const [isFeaturedValue, setIsFeaturedValue] = useState(false);
    const [productImagesArr, setProductImagesArr] = useState([]);
    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);

    const [files, setFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isDisable, setIsDisable] = useState(true);

    const context = useContext(MyContext);

    const history = useNavigate();

    const [formFields, setFormFields] = useState({
        name: '',
        subCat: '',
        description: '',
        brand: '',
        price: null,
        oldPrice: null,
        subCatId: '',   
        catName: '',
        countInStock: null,
        rating: null,
        isFeatured: false,
        category: '', // Ensure category field is included
        images: [], // Ensure images field is included
        discount: 0,
        productRAMS: '',
        productSIZE: '',
        productWEIGHT: ''
    });

    const productImages = useRef(); // Correctly initialize useRef

    const formdata = new FormData();

    const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:4000"; // Ensure this is the correct base URL

    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catData);
        setSubCatData(context.subCatData);
    }, []);


    useEffect(() => {
        if (!imgFiles) return;
        let tmp = [];
        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }

        setPreviews(tmp);

        // Free memory
        return () => {
            for (let i = 0; i < tmp.length; i++) {
                URL.revokeObjectURL(tmp[i]);
            }
        };
    }, [imgFiles]);

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            category: event.target.value
        }));
    };

    const handleChangeSubCategory = (event) => {
        setSubCatVal(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            subCat: event.target.value,
            subCatId: event.target.value // Correctly update subCatId
        }));
    };

    const handleChangeProductRams = (event) => {
        setProductRAMS(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            productRAMS: event.target.value // Correct the field name to subCat
        }));
    };

    const handleChangeProductWeight = (event) => {
        setProductWeight(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            productWEIGHT: event.target.value // Correct the field name to subCat
        }));
    };

    const handleChangeProductSize = (event) => {
        setProductSize(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            productSIZE: event.target.value // Correct the field name to subCat
        }));
    };

    const handleChangeIsFeaturedValue = (event) => {
        setIsFeaturedValue(event.target.value);
        setFormFields((prevFields) => ({
            ...prevFields,
            isFeatured: event.target.value
        }));
    };

    // Function to validate image URL
    const isValidImageUrl = (url) => {
        return (url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null);
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        // Parse countInStock and price to a number if the field is countInStock or price
        const parsedValue = (name === "countInStock" || name === "price" || name === "oldPrice") ? Number(value) : value;

        // Check if parsedValue is NaN for countInStock or price
        if ((name === "countInStock" || name === "price" || name === "oldPrice") && isNaN(parsedValue)) {
            console.error(`Invalid ${name} value`);
            context.setAlertBox({
                open: true,
                msg: `Invalid ${name} value`,
                error: true
            });
            return;
        }

        setFormFields((prevFields) => ({
            ...prevFields,
            [name]: parsedValue !== null ? parsedValue : '' // Ensure value is not null
        }));
    };

    const onChangeFile = (e) => {
        try {
            const imgArr = [];
            const files = e.target.files;

            // Validate file types
            for (let i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png')) {
                    imgArr.push(files[i]);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Please select valid JPG or PNG files only."
                    });
                    return;
                }
            }

            if (imgArr.length === 0) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "No valid images selected."
                });
                return;
            }

            setImgFiles(imgArr);
            setFiles(imgArr);
            setIsSelectedFiles(true);

            // Create a new FormData and append images to it
            const formdata = new FormData();
            imgArr.forEach((file, index) => {
                formdata.append(`images`, file);
            });

            // Debugging: Log FormData content
            for (let pair of formdata.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            // Call the API to upload images
            const apiEndPoint = `/api/products/upload`;
            postData(apiEndPoint, formdata)
                .then((res) => {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Images uploaded successfully!"
                    });
                    setIsLoading(false);
                    // Update previews with new image URLs if they're returned from the server
                    if (res.images && Array.isArray(res.images)) {
                        setPreviews(res.images);
                    }
                })
                .catch(err => {
                    console.error("Upload error:", err);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: `Failed to upload images. Error: ${err.response?.data?.message || err.message}`
                    });
                    setIsLoading(false);
                });
        } catch (error) {
            console.error("Error in file upload:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "An unexpected error occurred."
            });
            setIsLoading(false);
        }
    };

    const selectCat=(cat)=>{
        formFields.catName=cat;
    }

    const selectSubCat = (subCat) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            subCatId: subCat._id // Ensure subCatId is set correctly
        }));
    }

    const addProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formFields.name);
        formData.append('category', formFields.category);
        formData.append('subCatId', formFields.subCatId);
        formData.append('catName', formFields.catName);
        formData.append('subCat', formFields.subCat);
        formData.append('description', formFields.description);
        formData.append('brand', formFields.brand);
        formData.append('price', formFields.price);
        formData.append('rating', formFields.rating);
        formData.append('isFeatured', formFields.isFeatured);
        formData.append('countInStock', formFields.countInStock);
        formData.append('discount', formFields.discount);
        formData.append('productRAMS', formFields.productRAMS);
        formData.append('productSIZE', formFields.productSIZE);
        formData.append('productWEIGHT', formFields.productWEIGHT);

        // Add each file to FormData
        files.forEach(file => {
            formData.append('images', file);
        });

        postData(`/api/products/create`, formData)
            .then(res => {
                setIsLoading(false);
                history('/products');
            })

            .catch(err => {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'An error occurred while creating the product'
                });
                setIsLoading(false);
            });


        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product name',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return;
        }

        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add select a category',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return;
        }

        if (formFields.subCat === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add select a sub category',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return;
        }

        if (formFields.description === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product description',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }

        if (formFields.brand === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product brand',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }

        if (formFields.price === null || formFields.price === "" || isNaN(formFields.price)) {
            context.setAlertBox({
                open: true,
                msg: 'please add a valid product price',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }

        if (formFields.rating === null || formFields.rating === "") {
            context.setAlertBox({
                open: true,
                msg: 'please select a product rating',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }

        if (formFields.isFeatured === null || formFields.isFeatured === "") {
            context.setAlertBox({
                open: true,
                msg: 'please select if the product isFeatured',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }

        if (formFields.countInStock === null || formFields.countInStock === "" || isNaN(formFields.countInStock)) {
            context.setAlertBox({
                open: true,
                msg: 'please add a valid product stock count',
                error: true
            });
            setIsLoading(false); // Reset loading state
            return false;
        }
    };



    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product Upload</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Products"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Product Upload"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addProduct}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Basic Information</h5>

                                <div className='form-group'>
                                    <h6>PRODUCT NAME</h6>
                                    <input type='text' name="name" value={formFields.name || ''} onChange={inputChange} />
                                </div>

                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows={5} cols={10} name="description" value={formFields.description || ''} onChange={inputChange} />
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <h6>CATEGORY</h6>
                                        <Select
                                            value={categoryVal}
                                            onChange={handleChangeCategory}
                                            displayEmpty
                                         inputProps={{ 'aria-label': 'Without label' }}
                                            className='w-100'
                                        >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>

                                            {
                                                context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                                    return (
                                                        <MenuItem className="text-capitalize" value={cat._id} onClick={()=>selectCat(cat.name)} key={index}>{cat.name}</MenuItem>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>
                                </div>

                                 <br/>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <h6>SUB CATEGORY</h6>

                                        <Select
                                            value={subCatVal}
                                            onChange={handleChangeSubCategory}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className='w-100'
                                        >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>

                                            {
                                                context.subCatData?.SubCategoryList?.length !== 0 && context.subCatData?.SubCategoryList?.map((subCat, index) => {
                                                    return (
                                                        <MenuItem className="text-capitalize" value={subCat._id} onClick={() => selectSubCat(subCat)} key={index}>{subCat.subCat}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                                </div>

                                <br/>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRICE</h6>
                                            <input type='text' name="price" value={formFields.price || ''} onChange={inputChange} />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT STOCK</h6>
                                            <input type='text' name="countInStock" value={formFields.countInStock || ''} onChange={inputChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>BRAND</h6>
                                            <input type='text' name="brand" value={formFields.brand || ''} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>OLD PRICE</h6>
                                            <input type='text' name="oldPrice" value={formFields.oldPrice || ''} onChange={inputChange} />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>is Featured</h6>
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeIsFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>DISCOUNT</h6>
                                            <input type='text' name="discount" value={formFields.discount} onChange={inputChange} />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>PRODUCT RAMS</h6>
                                            <Select
                                                value={productRams}
                                                onChange={handleChangeProductRams}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value={'8GB'}>8GB</MenuItem>
                                                <MenuItem value={'6GB'}>6GB</MenuItem>
                                                <MenuItem value={'4GB'}>4GB</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>PRODUCT WEIGHT</h6>
                                            <Select
                                                value={productWeight}
                                                onChange={handleChangeProductWeight}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value={'8GB'}>8GB</MenuItem>
                                                <MenuItem value={'58GB'}>58GB</MenuItem>
                                                <MenuItem value={'60GB'}>60GB</MenuItem>
                                                <MenuItem value={'4GB'}>4GB</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>PRODUCT SIZE</h6>
                                            <Select
                                                value={productSize}
                                                onChange={handleChangeProductSize}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value={'1px'}>10px</MenuItem>
                                                <MenuItem value={'10px'}>10px</MenuItem>
                                                <MenuItem value={'20px'}>10px</MenuItem>
                                                <MenuItem value={'30px'}>10px</MenuItem>
                                                <MenuItem value={'40px'}>10px</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <h6>RATINGS</h6>
                                            <Rating
                                                name="simple-controlled"
                                                value={ratingsValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    setFormFields(() => ({
                                                        ...formFields,
                                                        rating: newValue
                                                    }))
                                                }}
                                            />
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 mt-0">
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">Media And Published</h5>

                            <div className="imgUploadBox">
                                {previews?.length !== 0 && previews?.map((img, index) => (
                                    <div className='uploadBox' key={index}>
                                        <img src={img} className="w-100" alt="preview" />
                                    </div>
                                ))}

                                <div className="uploadBox">
                                    <input type="file" multiple onChange={onChangeFile} name="images" />
                                    <div className='info'>
                                        <FaRegImages />
                                        <h5>Upload Images</h5>
                                    </div>
                                </div>

                            <br />
                        </div>
                            <Button type="submit" className='btn-blue btn-lg btn-big w-100'>
                                <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                            </Button>
                            </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ProductUpload;