const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    condition: {
        type: String,
        required: [true, 'Condition is required'],
        enum: {
            values: ['New', 'Like New', 'Very Good', 'Good', 'Other'],
            message: 'Condition must be New, Like New, Very Good, Good, or Other'
        }
    },
    seller: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0.01, 'Price must be greater than or equal to 0.01']
    },
    details: {
        type: String,
        required: [true, 'Details are required']
    },
    image: {
        type: String,
        required: [true, 'Image file path is required']
    },
    active: {
        type: Boolean,
        default: true
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    totalOffers: {
        type: Number,
        default: 0
    },
    highestOffer: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Item', itemSchema);