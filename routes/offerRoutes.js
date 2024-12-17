const express = require('express');
const offerController = require('../controllers/offerController');
const { isLoggedIn, isSeller } = require('../middleware/auth');
const { validateId, validateOffer } = require('../middleware/validator');
const router = express.Router({ mergeParams: true });


router.post('/', isLoggedIn, validateId, validateOffer, offerController.makeOffer);

// GET /vinyls/:id/offers - View all offers for an item
router.get('/', isLoggedIn, validateId, isSeller, offerController.viewOffers);

// Route to accept an offer
router.post('/:offerId/accept', isLoggedIn, isSeller, offerController.acceptOffer);

module.exports = router;
