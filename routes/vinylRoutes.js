const express = require('express');
const vinylController = require('../controllers/vinylController');
const offerRoutes = require('./offerRoutes');
const router = express.Router();
const upload = require('../middleware/upload');
const { isLoggedIn, isSeller } = require('../middleware/auth');
const { validateId, validateVinyl } = require('../middleware/validator');

// GET /vinyls: send all vinyls to the user
router.get('/', vinylController.items);

// GET /vinyls/new: render form to create a new vinyl
router.get('/new', isLoggedIn, vinylController.new);

// POST /vinyls: create a new vinyl
router.post('/', isLoggedIn, validateVinyl, upload.single('imageUpload'), vinylController.create);

// GET /vinyls/:id - gets a vinyl with a specific id
router.get('/:id', validateId, vinylController.show);

// GET /vinyls/:id/edit - render edit form for a specific vinyl
router.get('/:id/edit', validateId, isSeller, vinylController.edit);

// PUT /vinyls/:id - update a vinyl with a specific id
router.put('/:id', isLoggedIn, validateId, isSeller, upload.single('imageUpload'), vinylController.update);

// DELETE /vinyls/:id - delete a vinyl with a specific id
router.delete('/:id', isLoggedIn, validateId, isSeller, vinylController.delete);

// Use offerRoutes for routes under /vinyls/:id/offers
router.use('/:id/offers', validateId, offerRoutes);

module.exports = router;
