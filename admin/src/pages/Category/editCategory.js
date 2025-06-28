import React, { useState, useContext, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";  
import Button from '@mui/material/Button';
import { fetchDataFromApi, editData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useParams } from 'react-router-dom';

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

const EditCategory = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: '',
    });

    const [files, setFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const context = useContext(MyContext);
    const [category, setCategory] = useState([]);
    const { id } = useParams();
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const [isSelectedImages, setIsSelectedImages] = useState(false);

    useEffect(() => {
        context.setProgress(40);
        fetchDataFromApi(`/api/category/${id}`).then((res) => {
            setCategory(res);
            setFormFields({
                name: res.name,
                color: res.color
            });
            setPreviews(res.images);
            context.setProgress(100);
        });
    }, [id]);

    const changeInput = (e) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            [e.target.name]: e.target.value
        }));
    };

    const addCategory = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation: Check for empty fields
        if (!formFields.name || !formFields.color) {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                color: 'error',
                msg: 'Please fill all fields and upload at least one image'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', formFields.name);
        formData.append('color', formFields.color);


        // Add each file to FormData
        files.forEach(file => {
            formData.append('images', file);
        });

        editData(`/api/category/${id}`, formData, 'PUT')  // Corrected endpoint and method
            .then(res => {
                setIsLoading(false);
                navigate('/category');
            })
            .catch(err => {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'An error occurred while updating the category'
                });
                setIsLoading(false);
                context.fetchCategory();
            });
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
                        msg: "Please select a valid JPG or PNG file."
                    });
                    return;
                }
            }

            setImgFiles(imgArr);
            setFiles(imgArr);
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Images uploaded!"
            });

            setIsSelectedFiles(true);

            // Create a new FormData and append images to it
            const formdata = new FormData();
            imgArr.forEach(file => {
                formdata.append('images', file); // Append each image to formdata
            });

            // Call the API to upload images
            const apiEndPoint = `/api/category/${id}/upload`;  // Correct upload endpoint
            setIsLoading(true); // Start loader
            editData(apiEndPoint, formdata)
                .then((res) => {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Images uploaded successfully!"
                    });
                    setIsLoading(false); // Stop loader
                    // Update previews with new image URLs
                    setPreviews(prev => [...prev, ...res.images]);
                })
                .catch(err => {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Failed to upload images."
                    });
                    setIsLoading(false); // Stop loader
                });
        } catch (error) {
            console.log("Error in file upload:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "An unexpected error occurred."
            });
            setIsLoading(false); // Stop loader
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Edit Category</h5>
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
                            label="Edit Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className="form" onSubmit={addCategory}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4">
                                <div className="form-group">
                                    <h6>NAME</h6>
                                    <input type="text" name="name" value={formFields.name} onChange={changeInput} />
                                </div>
                                <div className="form-group">
                                    <h6>COLOR</h6>
                                    <input type="text" name="color" value={formFields.color} onChange={changeInput} />
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
                                                <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/category/upload')} name="images" />
                                                <div className='info'>
                                                    <FaRegImages />
                                                    <h5>Upload Images</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <Button type="submit" className="btn-blue btn-lg btn-big">
                                    <FaCloudUploadAlt /> &nbsp;{isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCategory;
