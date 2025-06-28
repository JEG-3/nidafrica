import React, { useContext, useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import { Link } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardBox from "../Dashboard/components/dashboardBox";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import Checkbox from '@mui/material/Checkbox';
import { MyContext } from "../../App";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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

const Products = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filters, setFilters] = useState({ showBy: '', categoryBy: '' });
    const open = Boolean(anchorEl);
    const context = useContext(MyContext);
    const [productList, setProductList] = useState([]);
    const [catData, setCatData] = useState([]);

    const baseUrl = "http://localhost:4000"; // Adjust the base URL as needed

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi("/api/products")
            .then((res) => {
                setProductList(res);
                context.setProgress(100);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                context.setProgress(100);
            });
    }, []);

    const deleteProduct = (id) => {
        console.log("Deleting product with ID:", id);
        context.setProgress(40);
        deleteData(`/api/products/${id}`)
            .then(() => {
                context.setProgress(100);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Product Deleted',
                });
                fetchDataFromApi("/api/products").then((res) => {
                    setProductList(res);
                });
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Product List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Product"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                        <Link to='/product/upload'>
                            <Button className="btn-blue ml-3 pl-3 pr-3">Add Product</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
                <div className="col-md-12">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} />
                        <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} />
                        <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} />
                    </div>
                </div>
            </div>

            <div className="card shadow border-0 p-3 mt-4">
                <h3 className="hd">Best Selling Products</h3>

                <div className="row cardFilters mt-3">
                    <div className="col-md-3">
                        <h4>SHOW BY</h4>
                        <FormControl size="small" className="w-100">
                            <Select
                                value={filters.showBy}
                                onChange={(e) => setFilters({ ...filters, showBy: e.target.value })}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                labelId="demo-select-small-label"
                                className="w-100"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="col-md-3">
                        <h4>CATEGORY BY</h4>
                        <FormControl size="small" className="w-100">
                            <Select
                                value={filters.categoryBy}
                                onChange={(e) => setFilters({ ...filters, categoryBy: e.target.value })}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                labelId="demo-select-small-label"
                                className="w-100"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                        return (
                                            <MenuItem className="text-capitalize" value={cat._id} key={index}>{cat.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped v-align">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '300px' }}>PRODUCT</th>
                                <th>CATEGORY</th>
                                <th style={{ width: '100px' }}>SUB CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRICE</th>
                                <th>STOCK</th>
                                <th>RATING</th>
                                <th>DISCOUNT</th>
                                <th style={{ width: '200px' }}>PRODUCT RAMS</th>
                                <th style={{ width: '200px' }}>PRODUCT WEIGHT</th>
                                <th style={{ width: '200px' }}>PRODUCT SIZE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productList?.products && productList.products.length > 0 ?
                                productList.products.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0">
                                                        <img src={item.images[0]} alt='' className="w-100" />
                                                    </div>
                                                </div>
                                                <div className="info pl-3">
                                                <h6>{item.name}</h6>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item?.category?.name}</td>
                                     <td>{item?.subCat?.subCat || ''}</td>
                                        <td>{item?.brand}</td>
                                        <td>
                                            <div style={{ width: '70px' }}>
                                                <del className="old">$ {item.oldPrice}</del>
                                                <span className="new text-danger">$ {item.price}</span>
                                            </div>
                                        </td>
                                        <td>{item.countInStock}</td>
                                        <td>
                                            <Rating
                                                name="read-only"
                                                defaultValue={item.rating}
                                                precision={0.5}
                                                size="small"
                                                readOnly
                                            />
                                        </td>
                                        <td>{item?.discount}</td>
                                        <td>{item?.productRAMS}</td>
                                        <td>{item?.productSIZE}</td>
                                        <td>{item?.productWEIGHT}</td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/product/details/${item._id}`}>
                                                    <Button className="secondary" color="secondary">
                                                        <FaEye />
                                                    </Button>
                                                </Link>

                                                <Link to={`/product/edit/${item._id}`}>
                                                    <Button className="success" color="success">
                                                        <FaPencilAlt />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    className="error"
                                                    color="error"
                                                    onClick={() => deleteProduct(item._id)}
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) :
                                <tr>
                                    <td colSpan="7" className="text-center">No products available</td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    <div className="d-flex tableFooter">
                        <p>
                            showing <b>{productList?.products?.length || 0}</b> of <b>{productList?.totalProducts || 0}</b> results
                        </p>
                        <Pagination
                            count={productList?.totalPages || 1}
                            className="pagination"
                            color="primary"
                            showFirstButton
                            showLastButton
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;