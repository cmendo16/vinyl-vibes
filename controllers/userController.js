const User = require('../models/user');
const Vinyl = require('../models/vinyl');
const Offer = require('../models/offer');

// display the registration form 
exports.new = (req, res) => {
    res.render('./user/new', { cssFile: '/user/new.css' });
};

// create the new account 
exports.createAccount = (req, res, next) => {
    const user = new User(req.body);

    user.save()
        .then(() => {
            req.flash('success', 'Registration successful! Please log in.');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has already been used.');
                return res.redirect('/users/new');
            }

            next(err);
        });
};

// Display the login page
exports.login = (req, res) => {
    res.render('./user/login', { cssFile: '/user/login.css' });
};

// authenticate user login 
exports.authenticateLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Incorrect email address.');
                return res.redirect('/users/login');
            }

            user.comparePassword(password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.user = user._id;
                        req.flash('success', 'Successfully logged in!');
                        return res.redirect('/users/profile');
                    } else {
                        req.flash('error', 'Incorrect password.');
                        return res.redirect('/users/login');
                    }
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
};


exports.profile = (req, res, next) => {
    const userId = req.session.user;

    Promise.all([
        User.findById(userId),
        Vinyl.find({ seller: userId }),
        Offer.find({ buyer: userId }).populate('item') 
    ])
        .then(([user, vinyls, offersMade]) => {
            if (!user) {
                req.flash('error', 'User not found.');
                return res.redirect('/users/login');
            }

            res.render('./user/profile', {
                cssFile: '/user/profile.css',user ,vinyls, offersMade 
            });
        })
        .catch(err => next(err));
};

// log user out and end session 
exports.logout = (req, res, next) => {

    // destroy the session 
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
