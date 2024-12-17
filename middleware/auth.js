const Vinyl = require('../models/vinyl');

// allow access only for guests (not logged-in users)
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in.');
        return res.redirect('/users/profile');
    }
};

// allow access only for logged-in users
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in to access this page.');
        return res.redirect('/users/login');
    }
};

// check if logged in user is the seller
exports.isSeller = async (req, res, next) => {
    try {
        const vinylId = req.params.id;

        // Find the vinyl by ID
        const vinyl = await Vinyl.findById(vinylId);

        // Check if vinyl exists
        if (!vinyl) {
            req.flash('error', `Item with ID ${vinylId} not found.`);
            return res.redirect('/users/profile');
        }

        // Check if the user is logged in
        if (!req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/users/login');
        }

        // Check if the logged-in user is the seller of the vinyl
        if (!vinyl.seller.equals(req.session.user)) {
            res.status(401);
            return res.render('error', {
                error: { message: 'You are not authorized to access this page', status: 401 },
                cssFile: '/error.css'
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};
