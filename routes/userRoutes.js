const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();
const { isGuest, isLoggedIn } = require('../middleware/auth');
const { validateRegistration, validateLogIn, validateResult } = require('../middleware/validator')

// get the registration form to create a new user
router.get('/new', isGuest, controller.new)

// create the users account 
router.post('/', isGuest, validateRegistration, validateResult, controller.createAccount);

// get the login form 
router.get('/login', isGuest, controller.login);

// authenticate the user's login 
router.post('/login', isGuest, controller.authenticateLogin);

// get the user's profile 
router.get('/profile', isLoggedIn, controller.profile);

//logout the user (( might be get but idk ))
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router; 