const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    source: String,
    dataType: String,
    status: String,
    country: String,
    lastUpdated: { type: Date, default: Date.now }
});

const MeasurementSchema = new mongoose.Schema({
    value: Number,
    unit: String,
    year: Number
});

const ProductionSchema = new mongoose.Schema({
    category: String,
    item: String,
    measurement: MeasurementSchema
});

const AnimalDataSchema = new mongoose.Schema({
    category: { type: String, required: true },
    item: { type: String, required: true },
    year: { type: Number, required: true },
    unit: { type: String, required: true },
    value: { type: Number, required: true },
    metadata: MetadataSchema,
    production: ProductionSchema
});

module.exports = mongoose.model('AnimalData', AnimalDataSchema);