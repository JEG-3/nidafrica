const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const { Category } = require("../models/category");
require("dotenv").config();

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

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // File will be saved in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Use timestamp to avoid file name collisions
    }
});

const upload = multer({ storage: storage }).array("images"); // Expecting an array of images

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    next();
};

// GET all categories
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Corrected: Use `req.query.page`
        const perPage = 8;

        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            categoryList, // Correct structure
            totalPages,
            page,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET category by ID
router.get("/:id", validateObjectId, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete("/:id", validateObjectId, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }

        const images = category.images;

        if (images.length !== 0) {
            for (const image of images) {
                if (image.startsWith('http')) {
                    // It's a Cloudinary URL, so we use Cloudinary's API to delete the image.
                    const publicId = image.split('/').pop().split('.')[0]; // Extract public ID from URL
                    await cloudinary.uploader.destroy(publicId);
                } else {
                    // It's a local file, so we try to unlink it
                    try {
                        fs.unlinkSync(`uploads/${image}`);
                    } catch (err) {
                        console.error(`Failed to delete local image file: ${image}`, err);
                    }
                }
            }
        }

        // Delete the category after removing images
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found!" });
        }
        
        res.json({ success: true, message: "Category deleted!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create a new category with image upload
router.post("/create", upload, async (req, res) => {
  const { name, color,  } = req.body; // Ensure  is included
  const images = req.files; // Access the uploaded files

  // Validation
  if (!name || !color || !images || images.length === 0) {
    return res.status(400).json({ error: "Name, color , and images are required!" });
  }

  try {
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(image => {
        return cloudinary.uploader.upload(image.path);
      })
    );

    // Get the URLs of the uploaded images
    const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

    // Create and save the category
    let category = new Category({
      name,
      color,
      images: imgUrls
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up uploaded images from the server (if necessary)
    images.forEach(image => {
      fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
    });
  }
});

// PUT update category by ID
router.put("/:id", validateObjectId, upload, async (req, res) => {
    const { name, color } = req.body; // Ensure  is included
    const images = req.files; // Access the uploaded files

    if (!name || !color ) {
        return res.status(400).json({ error: "Name, color are required!" });
    }

    try {
        let imgUrls = [];

        if (images && images.length > 0) {
            // Upload images to Cloudinary
            const uploadedImages = await Promise.all(
                images.map(image => {
                    return cloudinary.uploader.upload(image.path);
                })
            );

            // Get the URLs of the uploaded images
            imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, color, images: imgUrls.length > 0 ? imgUrls : undefined },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up uploaded images from the server (if necessary)
        if (images) {
            images.forEach(image => {
                fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
            });
        }
    }
});

// PUT upload images for a category by ID
router.put("/:id/upload", validateObjectId, upload, async (req, res) => {
  const images = req.files; // Access the uploaded files

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "Images are required!" });
  }

  try {
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(image => {
        return cloudinary.uploader.upload(image.path);
      })
    );

    // Get the URLs of the uploaded images
    const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

    // Update the category with the new images
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: imgUrls } } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found!" });
    }

    res.json({ images: imgUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up uploaded images from the server (if necessary)
    images.forEach(image => {
      fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
    });
  }
});

// POST upload images for a category
router.post("/upload", upload, async (req, res) => {
    const images = req.files; // Access the uploaded files

    if (!images || images.length === 0) {
        return res.status(400).json({ error: "Images are required!" });
    }

    try {
        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
            images.map(image => {
                return cloudinary.uploader.upload(image.path);
            })
        );

        // Get the URLs of the uploaded images
        const imgUrls = uploadedImages.map(uploadedImage => uploadedImage.secure_url);

        res.json({ images: imgUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up uploaded images from the server (if necessary)
        images.forEach(image => {
            fs.unlinkSync(image.path); // Delete the local files after uploading to Cloudinary
        });
    }
});

module.exports = router;
