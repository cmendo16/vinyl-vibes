const { body } = require('express-validator');
const { validationResult } = require('express-validator');

exports.validateId = (req, res, next) => {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    next();
}

// validate required fields in the vinyl 
exports.validateVinyl =
    [body('title', 'The title cannot be empty.').notEmpty().trim().escape(),
    body('condition', 'The condition but must be valid').escape().isIn(['New', 'Like New', 'Very Good', 'Good', 'Other']),
    body('price', 'Price must be currency').escape().isCurrency({ min: 0.01 }),
    body('details', 'Details cannot be empty').notEmpty().trim().escape()];

// validate the fields in the registration form 
exports.validateRegistration =
    [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name field cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email address must be valid.').notEmpty().trim().escape().normalizeEmail(),
    body('password', 'Password must have a minimum length of 8 and a maximum length of 64').isLength({ min: 8, max: 64 })];

// validate fields in the login 
exports.validateLogIn =
    [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })];

// validate offers 
exports.validateOffer =
    [body('amount', 'Amount must be a valid currency').escape().isCurrency({ min: 0.01 }),
    body('status', 'Status must be one of the following: pending, accepted, rejected').escape().isIn(['pending', 'accepted', 'rejected'])];


exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        })

        return res.redirect('back');
    } else {
        return next();
    }

}
