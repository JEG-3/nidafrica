const { Category } = require('../models/category.js');
const { Product } = require('../models/products.js');
const { RecentlyViewed } = require('../models/RecentlyViewed.js');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Ensure Cloudinary API key is set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Must supply Cloudinary cloud_name, api_key, and api_secret");
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads with file type validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Store files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed.'));
        }
        cb(null, true);
    },
});

// Route to handle file uploads
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
            files.map(file => {
                return cloudinary.uploader.upload(file.path);
            })
        );

        // Get the URLs of the uploaded images
        const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

        res.status(200).json({ message: 'Files uploaded successfully', images: imgUrls });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: 'Error uploading files', error });
    } finally {
        // Clean up uploaded images from the server
        req.files.forEach(file => {
            fs.unlinkSync(file.path); // Delete the local files after uploading to Cloudinary
        });
    }
});

// Create a new recently viewed product
router.post('/recentlyViewed', upload.array('images', 10), async (req, res) => {
    let images = [];
    try {
        const { category, subCat } = req.body;

        images = req.files || [];
        console.log("Received files:", images); // Debugging line
        if (images.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        // Validate category ID
        if (!category) {
            return res.status(400).json({ message: "Category is required!" });
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Invalid Category ID!" });
        }

        const categoryObj = await Category.findById(category);
        if (!categoryObj) {
            return res.status(404).json({ message: "Invalid Category!" });
        }

        // Validate subCat ID
        if (subCat && !mongoose.Types.ObjectId.isValid(subCat)) {
            return res.status(400).json({ message: "Invalid Sub Category ID!" });
        }

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
            images.map(image => {
                console.log("Uploading image path:", image.path); // Debugging line
                return cloudinary.uploader.upload(image.path)
                    .then(result => {
                        console.log("Cloudinary upload response:", result); // Debugging line
                        return result;
                    })
                    .catch(error => {
                        console.error("Error uploading to Cloudinary:", error); // Debugging line
                        throw error;
                    });
            })
        );

        // Get the URLs of the uploaded images
        const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);
        console.log("Uploaded image URLs:", imgUrls); // Debugging line

        let product = new RecentlyViewed({
            name: req.body.name,
            subCat: req.body.subCat,
            subCatId: req.body.subCatId,
            description: req.body.description,
            images: imgUrls,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            category,
            catName: categoryObj.name, // Set catName from category object
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            discount: req.body.discount,
            productRAMS: req.body.productRAMS,
            productSIZE: req.body.productSIZE,
            productWEIGHT: req.body.productWEIGHT,
            createdAt: moment().format(),
        });

        product = await product.save();
        if (!product) {
            res.status(500).json({
                message: "Failed to create RecentlyViewed",
                success: false
            });
        } else {
            res.status(201).json(product);
        }
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up uploaded images from the server (if necessary)
        images.forEach(image => {
            fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
        });
    }
});

router.get(`/recentlyViewed`, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const totalPosts = await RecentlyViewed.countDocuments(req.query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const productList = await RecentlyViewed.find(req.query)
            .populate("category subCat")
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (!productList.length) {
            return res.status(200).json({ message: "No products found", products: [], totalPages, page });
        }

        return res.status(200).json({
            products: productList,
            totalPages: totalPages,
            page: page
        });
    } catch (error) {
        console.error("Error fetching recently viewed products:", error);
        res.status(500).json({ message: 'Error fetching recently viewed products', error: error.message });
    }
});

router.post('/create', upload.array('images', 10), async (req, res) => {
    let images = [];
    try {
        const { name, subCat, description, brand, price, oldPrice, category, countInStock, rating, numReviews, isFeatured, discount, productRAMS,
            productSIZE, productWEIGHT, subCatId
        } = req.body;
        images = req.files || [];

        // Validate category ID
        if (!category) {
            return res.status(400).json({ message: "Category is required!" });
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Invalid Category ID!" });
        }
        console.log("Category data received:", category);

        const categoryObj = await Category.findById(category);
        if (!categoryObj) {
            return res.status(404).json({ message: "Invalid Category!" });
        }

        // Validate subCat ID
        if (subCat && !mongoose.Types.ObjectId.isValid(subCat)) {
            return res.status(400).json({ message: "Invalid Sub Category ID!" });
        }

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
            images.map(image => {
                return cloudinary.uploader.upload(image.path);
            })
        );

        // Get the URLs of the uploaded images
        const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

        const product = new Product({
            name,
            subCat,
            subCatId,
            description,
            images: imgUrls,
            brand,
            price,
            oldPrice,
            category,
            catName: categoryObj.name, // Set catName from category object
            countInStock,
            rating,
            numReviews,
            isFeatured,
            discount,
            productRAMS,
            productSIZE,
            productWEIGHT,
            createdAt: moment().format(),
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up uploaded images from the server (if necessary)
        images.forEach(image => {
            fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
        });
    }
});

// Get all products with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const subCatId = req.query.subCatId;
        const catName = req.query.catName;
        const minRating = parseInt(req.query.minRating) || 0;

        let query = {
            price: { $gte: minPrice, $lte: maxPrice },
            rating: { $gte: minRating }
        };

        if (subCatId) {
            query.subCatId = subCatId;
        }

        if (catName) {
            const category = await Category.findOne({ name: catName });
            if (category) {
                query.category = category._id;
            }
        }

        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const productList = await Product.find(query)
            .populate("category subCat")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (productList.length === 0) {
            return res.status(200).json({ message: "No products found", products: [], totalPages, page });
        }

        return res.status(200).json({
            products: productList,
            totalPages: totalPages,
            page: page
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get all featured products
router.get(`/featured`, async (req, res) => {
    try {
        const productList = await Product.find({ isFeatured: true });
        if (!productList) {
            res.status(200).json({ success: false });
        }
        res.status(200).json(productList);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: 'Error fetching featured products', error: error.message });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID!" });
        }

        const product = await Product.findById(productId).populate("category subCat");
        if (!product) {
            return res.status(404).json({ message: 'The product with the given ID was not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID!" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Delete associated images from Cloudinary
        const images = product.images || [];
        for (let image of images) {
            await cloudinary.uploader.destroy(image);  // Remove the image from Cloudinary
        }

        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: "The product is deleted!" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Update a product by ID
router.put('/:id', upload.array('images', 10), async (req, res) => {
    let newImages = [];
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID!" });
        }

        const { name, subCat, description, brand, price, oldPrice, category, countInStock, rating, numReviews, isFeatured } = req.body;
        newImages = req.files || [];

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'The product cannot be updated!' });
        }

        // Delete old images from Cloudinary if new images are uploaded
        if (newImages.length > 0) {
            for (let image of product.images) {
                await cloudinary.uploader.destroy(image); // Remove the old images from Cloudinary
            }
        }

        // Upload new images to Cloudinary
        const uploadedImages = await Promise.all(
            newImages.map(image => cloudinary.uploader.upload(image.path))
        );

        // Get the URLs of the uploaded images
        const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

        // Update product fields
        product.name = name || product.name;
        product.subCat = subCat || product.subCat;
        product.description = description || product.description;
        product.brand = brand || product.brand;
        product.price = price || product.price;
        product.oldPrice = oldPrice || product.oldPrice;
        product.category = category || product.category;
        product.catName = category ? (await Category.findById(category)).name : product.catName; // Update catName if category is provided
        product.countInStock = countInStock || product.countInStock;
        product.rating = rating || product.rating;
        product.numReviews = numReviews || product.numReviews;
        product.isFeatured = isFeatured || product.isFeatured;
        product.images = imgUrls.length > 0 ? imgUrls : product.images;

        const updatedProduct = await product.save();
        res.status(200).json({ message: 'The product is updated!', product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    } finally {
        // Clean up uploaded images from the server (if necessary)
        newImages.forEach(image => {
            fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
        });
    }
});

module.exports = router;
