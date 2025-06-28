const { SubCategory } = require('../models/subCat');
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 8;

        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const SubCategoryList = await SubCategory.find()
            .populate("category") // Ensure category field is populated
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            SubCategoryList,
            totalPages,
            page,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET all subcategories

// GET a single subcategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findById(req.params.id).populate("category");
        if (!subCat) {
            return res.status(404).json({ message: 'The subcategory with the given ID was not found!' });
        }
        return res.status(200).json(subCat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching subcategory", error: error.message });
    }
});

// POST create a new subcategory
router.post('/create', async (req, res) => {
    try {
        if (!req.body.category || !req.body.subCat) {
            return res.status(400).json({ message: "Category and SubCategory are required." });
        }

        // Create and save the subcategory
        let subCat = new SubCategory({
            category: req.body.category,
            subCat: req.body.subCat
        });

        subCat = await subCat.save();
        res.status(201).json(subCat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving subcategory", error: error.message });
    }
});

// DELETE subcategory by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deletedSubCat) {
            return res.status(404).json({
                message: "SubCategory not found!",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            message: 'Successfully deleted subcategory'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error deleting subcategory",
            error: error.message
        });
    }
});

// PUT update a subcategory by ID
router.put("/:id", async (req, res) => {
    try {
        const subCat = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                subCat: req.body.subCat,
            },
            { new: true }
        );

        if (!subCat) {
            return res.status(500).json({
                message: "SubCategory cannot be updated!",
                success: false
            });
        }

        res.status(200).json(subCat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating subcategory",
            error: error.message
        });
    }
});

module.exports = router;
