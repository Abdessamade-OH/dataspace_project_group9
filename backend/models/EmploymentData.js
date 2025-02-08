// models/EmploymentData.js
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
    dataType: String,
    status: String,
    lastUpdated: { type: Date, default: Date.now }
});

const EmploymentDataSchema = new mongoose.Schema({
    indicator: String,
    sex: String,
    year: Number,
    element: String,
    source: String,
    unit: String,
    value: Number,
    metadata: MetadataSchema
});

module.exports = mongoose.model('EmploymentData', EmploymentDataSchema);