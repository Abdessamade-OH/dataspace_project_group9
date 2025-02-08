// models/ProductionData.js
const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        set: (value) => {
            if (value && value.$numberLong) {
                return new Date(parseInt(value.$numberLong, 10));
            }
            return value;
        }
    },
    source: String,
    status: String
});

const ProductionDataSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    category: { type: String, required: true },
    product: { type: String, required: true },
    indicator: { type: String, required: true },
    value: { type: Number, required: true },
    metadata: MetadataSchema
});

module.exports = mongoose.model('ProductionData', ProductionDataSchema);