const express = require('express');
const AnimalData = require('../models/AnimalsData'); // Ensure the model name matches
const router = express.Router();

// Test route to check if the animals route is working
router.get('/test', (req, res) => {
    res.json({ message: 'Animals route is working!' });
});

// Bulk Update (PUT) - Update the entire dataset at once
router.put('/bulk-update', async (req, res) => {
    try {
        const { documents } = req.body; // Expect an array of documents

        // Transform the createdAt field in metadata
        const transformedDocuments = documents.map(doc => {
            if (doc.metadata && doc.metadata.createdAt && doc.metadata.createdAt.$numberLong) {
                // Convert $numberLong to a valid Date object
                doc.metadata.createdAt = new Date(parseInt(doc.metadata.createdAt.$numberLong, 10));
            }
            return doc;
        });

        // Delete all existing data
        await AnimalData.deleteMany({});

        // Insert new data
        const newData = await AnimalData.insertMany(transformedDocuments);

        res.json({
            message: "Bulk update successful",
            documents: newData
        });
    } catch (error) {
        res.status(400).json({ error: "Error during bulk update", details: error.message });
    }
});
// Create (POST) - Add new animal data
router.post('/', async (req, res) => {
    try {
        const newData = new AnimalData(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ error: "Error adding data", details: error.message });
    }
});

// Read All (GET) - Fetch all animal data
router.get('/', async (req, res) => {
    try {
        const data = await AnimalData.find();
        res.json({
            _id: { $oid: "678cde0e35f96e73172a8b30" }, // Example ID
            collection: "animals_data",
            database: "agriculture_data",
            documents: data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching animal data", details: error.message });
    }
});

// Read by Year (GET) - Fetch animal data for a specific year
router.get('/:year', async (req, res) => {
    try {
        const data = await AnimalData.find({ year: req.params.year });
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the specified year" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by year", details: error.message });
    }
});

// Read by ID (GET) - Fetch a single animal data entry by its ID
router.get('/id/:id', async (req, res) => {
    try {
        const data = await AnimalData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data by ID", details: error.message });
    }
});

// Update (PUT) - Update an existing animal data entry by its ID
router.put('/:id', async (req, res) => {
    try {
        const updatedData = await AnimalData.findByIdAndUpdate(
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

// Delete (DELETE) - Delete an animal data entry by its ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await AnimalData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully", deletedData });
    } catch (error) {
        res.status(500).json({ error: "Error deleting data", details: error.message });
    }
});

module.exports = router;