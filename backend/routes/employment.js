// routes/employment.js
const express = require('express');
const EmploymentData = require('../models/EmploymentData');
const router = express.Router();

// Test route to check if the employment route is working
router.get('/test', (req, res) => {
    res.json({ message: 'Employment route is working!' });
});

// Bulk Update (PUT) - Update the entire dataset at once
router.put('/bulk-update', async (req, res) => {
    try {
        const { documents } = req.body; // Expect an array of documents

        // Delete all existing data
        await EmploymentData.deleteMany({});

        // Insert new data
        const newData = await EmploymentData.insertMany(documents);

        res.json({
            message: "Bulk update successful",
            documents: newData
        });
    } catch (error) {
        res.status(400).json({ error: "Error during bulk update", details: error.message });
    }
});

// Create (POST) - Add new employment data
router.post('/', async (req, res) => {
    try {
        const newData = new EmploymentData(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ error: "Error adding data", details: error.message });
    }
});

// Read All (GET) - Fetch all employment data
router.get('/', async (req, res) => {
    try {
        const data = await EmploymentData.find();
        res.json({
            _id: { $oid: "678cff7835f96e73172a8b38" }, // Example ID
            collection: "employment_data",
            database: "agriculture_data",
            documents: data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching employment data", details: error.message });
    }
});

// Read by Year (GET) - Fetch employment data for a specific year
router.get('/:year', async (req, res) => {
    try {
        const data = await EmploymentData.find({ year: req.params.year });
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the specified year" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by year", details: error.message });
    }
});

// Read by ID (GET) - Fetch a single employment data entry by its ID
router.get('/id/:id', async (req, res) => {
    try {
        const data = await EmploymentData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by ID", details: error.message });
    }
});

// Update (PUT) - Update an existing employment data entry by its ID
router.put('/:id', async (req, res) => {
    try {
        const updatedData = await EmploymentData.findByIdAndUpdate(
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

// Delete (DELETE) - Delete an employment data entry by its ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await EmploymentData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully", deletedData });
    } catch (error) {
        res.status(500).json({ error: "Error deleting data", details: error.message });
    }
});

module.exports = router;