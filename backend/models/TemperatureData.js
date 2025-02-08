// models/TemperatureData.js
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
    region: String,
    country: String,
    lastUpdated: Date
});

const MeasurementSchema = new mongoose.Schema({
    value: Number,
    unit: String,
    period: {
        month: String,
        year: Number
    }
});

const TemperatureDataSchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: Number, required: true },
    unit: { type: String, required: true },
    temperature: { type: Number, required: true },
    metadata: MetadataSchema,
    measurement: MeasurementSchema
});

module.exports = mongoose.model('TemperatureData', TemperatureDataSchema);