// models/CreditData.js
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
    country: String,
    lastUpdated: { type: Date, default: Date.now }
});

const MeasurementSchema = new mongoose.Schema({
    value: Number,
    unit: String,
    year: Number
});

const CreditSchema = new mongoose.Schema({
    type: String,
    measurement: MeasurementSchema
});

const CreditDataSchema = new mongoose.Schema({
    metadata: MetadataSchema,
    credit: CreditSchema
});

module.exports = mongoose.model('CreditData', CreditDataSchema);