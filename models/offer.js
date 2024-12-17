const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {
        type: Number, required: true,
        min: 0.01
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
});

module.exports = mongoose.model('Offer', offerSchema);
