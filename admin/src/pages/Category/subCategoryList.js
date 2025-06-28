import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { fetchDataFromApi, editData, deleteData } from '../../utils/api';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light'
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

const SubCategory = () => {
    const [subCatData, setSubCatData] = useState([]);

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);



    const context = useContext(MyContext);

    useEffect(() => {
      window.scrollTo(0, 0);
      context.setProgress(20);
      fetchDataFromApi(`/api/subCat?page=`).then((res) => {
        if (res && res.SubCategoryList) {
          setSubCatData(res);
        } else {
          // Handle case where no categories are returned
          setSubCatData({ SubCategoryList: [], totalPages: 1 });
        }
        context.setProgress(100);
      }).catch((error) => {
        console.error("Error fetching subCategories:", error);
        // Handle error case, maybe set an error state
      });
    }, [page]);
    
    
    const deleteCat = (id) => {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            console.error("Invalid ObjectId:", id);
            return;
        }
        deleteData(`/api/subCat/${id}`).then(() => {
            fetchDataFromApi(`/api/subCat?page=${page}`).then((res) => {
                setSubCatData(res);
            });
        });
    };

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/subCat?page=${value}`).then((res) => {
            setSubCatData(res);
            context.setProgress(100);
        });
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">SubCategory List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Category"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                        <Link to='/subCategory/add'><Button className="btn-blue ml-3 pl-3 pr-3">Add subCat</Button></Link>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                    <th style={{ width: '100px' }}>IMAGE</th>
                                    <th>Category</th>
                                    <th>SubCat</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  subCatData?.SubCategoryList?.length !== 0 && subCatData?.SubCategoryList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <Checkbox {...label} /> <span>#{index + 1}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0">
                                                       
                                                            <img src={item.images[0]} alt="category" className="w-100" />
                                                     
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.category.name}</td>
                                        <td>{item.subCat}</td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/subCategory/edit/${item.id}`}>
                                                <Button className="success" color="success">
                                                    <FaPencilAlt />
                                                </Button>
                                                </Link>
                                                <Button className="error" color="error" onClick={() => deleteCat(item.id)}>
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> {/* Ensure table is closed */}

                        <div className="d-flex tableFooter">
                            <Pagination 
                                count={subCatData?.totalPages} 
                                className="pagination"
                                color="primary" 
                                showFirstButton 
                                showLastButton 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubCategory;