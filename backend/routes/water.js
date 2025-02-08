// routes/water.js
const express = require('express');
const WaterData = require('../models/WaterData');
const router = express.Router();

// Test route to check if the water route is working
router.get('/test', (req, res) => {
    res.json({ message: 'Water route is working!' });
});

// Bulk Update (PUT) - Update the entire dataset at once
router.put('/bulk-update', async (req, res) => {
    try {
        const { documents } = req.body; // Expect an array of documents

        // Delete all existing data
        await WaterData.deleteMany({});

        // Insert new data
        const newData = await WaterData.insertMany(documents);

        res.json({
            message: "Bulk update successful",
            documents: newData
        });
    } catch (error) {
        res.status(400).json({ error: "Error during bulk update", details: error.message });
    }
});

// Create (POST) - Add new water data
router.post('/', async (req, res) => {
    try {
        const newData = new WaterData(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ error: "Error adding data", details: error.message });
    }
});

// Read All (GET) - Fetch all water data
router.get('/', async (req, res) => {
    try {
        const data = await WaterData.find();
        res.json({
            _id: { $oid: "678c2894da3c1e5bbe036b4c" }, // Example ID
            collection: "water_data",
            database: "agriculture_data",
            documents: data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching water data", details: error.message });
    }
});

// Read by Name (GET) - Fetch water data for a specific name
router.get('/name/:name', async (req, res) => {
    try {
        const data = await WaterData.find({ name: req.params.name });
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the specified name" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by name", details: error.message });
    }
});

// Read by ID (GET) - Fetch a single water data entry by its ID
router.get('/id/:id', async (req, res) => {
    try {
        const data = await WaterData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by ID", details: error.message });
    }
});

// Update (PUT) - Update an existing water data entry by its ID
router.put('/:id', async (req, res) => {
    try {
        const updatedData = await WaterData.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ error: "Error updating data", details: error.message });
    }
});

// Delete (DELETE) - Delete a water data entry by its ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await WaterData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully", deletedData });
    } catch (error) {
        res.status(500).json({ error: "Error deleting data", details: error.message });
    }
});

module.exports = router;