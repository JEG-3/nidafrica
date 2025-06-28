import axios from "axios";

// Use an environment variable for the base URL, fallback to localhost if not set
const BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_BASE_URL) || "http://localhost:4000";

// Function to fetch data from the API
export const fetchDataFromApi = async (url) => {
    try {
        console.log("Requesting URL:", `${BASE_URL}${url}`);
        const { data } = await axios.get(`${BASE_URL}${url}`);
        return data;
    } catch (error) {
        console.error("Error fetching data:", {
            url: `${BASE_URL}${url}`,
            status: error.response?.status,
            message: error.message,
            response: error.response?.data,
        });
        throw error;
    }
};

// Function to post data to the API
export const postData = async (url, data) => {
    try {
        const config = {
            headers: {
                'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
            }
        };
        const response = await axios.post(url.startsWith('http') ? url : `${BASE_URL}${url}`, data, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
            if (error.response.status === 404) {
                throw new Error('API endpoint not found. Please check the URL.');
            } else if (error.response.status === 500) {
                throw new Error('Internal Server Error. Please check the server logs.');
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Request data:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
        }
        throw error;
    }
};

// Function to edit data in the API
export const editData = async (url, updatedData) => {
    try {
        const { data } = await axios.put(`${BASE_URL}${url}`, updatedData);
        return data;
    } catch (error) {
        console.error("Error editing data:", error);
        throw error;
    }
};

// Function to delete data from the API
export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}${url}`);
        return data;
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};
