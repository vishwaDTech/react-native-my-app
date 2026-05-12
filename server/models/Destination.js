const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a destination name'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    duration: {
        type: String,
        required: [true, 'Please add duration (e.g., 3 Days, 2 Nights)']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
