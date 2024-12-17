const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is require']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Please enter a unique email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    offersMade: [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    itemsForSale: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }]
});

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});


userSchema.methods.comparePassword = function (inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
}


module.exports = mongoose.model('User', userSchema);