// routes/credit.js
const express = require('express');
const CreditData = require('../models/CreditsData');
const router = express.Router();

// Test route to check if the credit route is working
router.get('/test', (req, res) => {
    res.json({ message: 'Credit route is working!' });
});

// Bulk Update (PUT) - Update the entire dataset at once
router.put('/bulk-update', async (req, res) => {
    try {
        const { documents } = req.body; // Expect an array of documents

        // Delete all existing data
        await CreditData.deleteMany({});

        // Insert new data
        const newData = await CreditData.insertMany(documents);

        res.json({
            message: "Bulk update successful",
            documents: newData
        });
    } catch (error) {
        res.status(400).json({ error: "Error during bulk update", details: error.message });
    }
});

// Create (POST) - Add new credit data
router.post('/', async (req, res) => {
    try {
        const newData = new CreditData(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ error: "Error adding data", details: error.message });
    }
});

// Read All (GET) - Fetch all credit data
router.get('/', async (req, res) => {
    try {
        const data = await CreditData.find();
        res.json({
            _id: { $oid: "678ceb3335f96e73172a8b33" }, // Example ID
            collection: "credit_data",
            database: "agriculture_data",
            documents: data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching credit data", details: error.message });
    }
});

// Read by Year (GET) - Fetch credit data for a specific year
router.get('/:year', async (req, res) => {
    try {
        const data = await CreditData.find({ 'credit.measurement.year': req.params.year });
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the specified year" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by year", details: error.message });
    }
});

// Read by ID (GET) - Fetch a single credit data entry by its ID
router.get('/id/:id', async (req, res) => {
    try {
        const data = await CreditData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by ID", details: error.message });
    }
});

// Update (PUT) - Update an existing credit data entry by its ID
router.put('/:id', async (req, res) => {
    try {
        const updatedData = await CreditData.findByIdAndUpdate(
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

// Delete (DELETE) - Delete a credit data entry by its ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await CreditData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully", deletedData });
    } catch (error) {
        res.status(500).json({ error: "Error deleting data", details: error.message });
    }
});

module.exports = router;