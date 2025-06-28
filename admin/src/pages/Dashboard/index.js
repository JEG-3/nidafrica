import React, { useContext, useEffect, useState } from "react";
import DashboardBox from "./components/dashboardBox";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button'; // Added Button import
import { fetchDataFromApi, deleteData } from "../../utils/api";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";

// Static data for the chart (could be replaced with dynamic data)
export const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
];

export const options = {
    backgroundColor: 'transparent',
    chartArea: { width: '100%', height: '100%' },
};

const Dashboard = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [productList, setProductList] = useState({ products: [] }); // Initialize products array safely
    const [loading, setLoading] = useState(true); // Track loading state for API calls
    const ITEM_HEIGHT = 48;
    const context = useContext(MyContext);

    // Menu handler for settings or actions
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // Pagination handler for product list
    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });
    };

    // Delete product handler
    const deleteProduct = async (id) => {
        try {
            context.setProgress(40);
            const response = await deleteData(`api/products/${id}`);
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted',
            });
            // Refresh product list
            const refreshedData = await fetchDataFromApi("/api/products");
            setProductList(refreshedData);
        } catch (error) {
            console.error("Error deleting product:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to delete product',
            });
            context.setProgress(100);
        }
    };
    

    // Fetch product data on mount
    useEffect(() => {
        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/products").then((res) => {
            if (res && Array.isArray(res?.products)) {
                setProductList(res);  // Update product list state
            } else {
                setProductList({ products: [] }); // Fallback in case of bad response
            }
            setLoading(false); // Set loading to false once data is fetched
        }).catch(() => {
            setLoading(false); // Set loading to false even if the fetch fails
            setProductList({ products: [] }); // Fallback to empty products
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to fetch products'
            });
        });
    }, [context]);

    return (
        <div className="right-content w-100">
            {/* Dashboard Boxes */}
            <div className="row dashboardBoxWrapperRow">
                <div className="col-md-8">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} />
                        <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} />
                        <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} />
                        <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} />
                    </div>
                </div>

                <div className="col-md-4 pl-0 topPart2">
                    <div className="box graphBox">
                        <div className="d-flex align-items-center w-100 bottomEle">
                            <h6 className="text-white mb-0 mt-0">Total Sales</h6>
                            <div className="ml-auto">
                                <Button className="ml-auto toggleIcon" onClick={handleClick}><HiDotsVertical /></Button>
                                <Menu
                                    className="dropdown_menu"
                                    MenuListProps={{ 'aria-labelledby': 'long-button' }}
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>Action 1</MenuItem>
                                    <MenuItem onClick={handleClose}>Action 2</MenuItem>
                                </Menu>
                            </div>
                        </div>
                        <Chart
                         chartType="PieChart"
                         data={data}
                         options={options}
                         width="100%"
                         height="400px"
                        />
                    </div>
                </div>
            </div>

            {/* Product Table */}
            <div className="table-responsive mt-3">
                <table className="table table-bordered table-striped v-align">
                    <thead className="thead-dark">
                        <tr>
                            <th>UID</th>
                            <th style={{ width: '300px' }}>PRODUCT</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>PRICE</th>
                            <th>STOCK</th>
                            <th>RATING</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                        <tbody>
    {
        productList?.products?.length > 0 ? (
            productList.products.map((item, index) => (
                <tr key={item.id || index}>
                    <td>
                        <div className="d-flex align-items-center">
                        <Checkbox inputProps={{ 'aria-label': 'Checkbox demo' }} />  <span>#1</span>
                        </div>
                    </td>
                    <td>
                        <div className="d-flex align-items-center productBox">
                            <div className="imgWrapper">
                                <div className="img card shadow m-0">
                                    <img src={`${context.baseUrl}/uploads/${item.images[0]}`} className="w-100" alt={item.name} />
                                </div>
                            </div>
                            <div className="info pl-3">
                                <h6>{item.name}</h6>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    </td>
                    <td>{item.category ? item.category.name : 'Unknown'}</td>
                    <td>{item.brand}</td>
                    <td>
                        <div style={{ width: '70px' }}>
                            <del className="old">$ {item.oldPrice}</del>
                            <span className="new text-danger">$ {item.price}</span>
                        </div>
                    </td>
                    <td><Rating name="read-only" defaultValue={item.rating} precision={0.5} size="small" readOnly /></td>
                    <td>
                        <div className="actions d-flex align-items-center">
                            <Link to="/product/details">
                                <Button className="secondary" color="secondary"><FaEye /></Button>
                            </Link>
                            <Button className="success" color="success"><FaPencilAlt /></Button>
                            <Button className="error" color="error" onClick={() => deleteProduct(item.id)}><MdDelete /></Button>
                        </div>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" className="text-center">No products available</td>
            </tr>
        )
    }
                        </tbody>
                </table>

                <div className="d-flex tableFooter">
                    <p>showing <b>{productList?.products?.length || 0}</b> of <b>{productList?.total || 0}</b> results</p>
                    <Pagination
                        count={productList?.totalPages || 0}
                        color="primary"
                        className="pagination"
                        showFirstButton
                        showLastButton
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
