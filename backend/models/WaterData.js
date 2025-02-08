// models/WaterData.js
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

const LocationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const WaterDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    metadata: MetadataSchema,
    location: LocationSchema
});

module.exports = mongoose.model('WaterData', WaterDataSchema);