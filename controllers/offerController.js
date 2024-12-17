const Offer = require('../models/offer');
const Vinyl = require('../models/vinyl');

exports.makeOffer = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { amount } = req.body;
        const buyer = req.session.user;

        // Find the vinyl
        const vinyl = await Vinyl.findById(id);
        if (!vinyl || !vinyl.active) {
            const err = new Error('Vinyl not found or inactive.');
            err.status = 404;
            return next(err);
        }

        if (vinyl.seller.toString() === buyer) {
            const err = new Error('You cannot make an offer on your own vinyl.');
            err.status = 401;
            return next(err);
        }

        const offer = new Offer({ amount, buyer, item: id });
        await offer.save();

        await Vinyl.findByIdAndUpdate(id, {
            $inc: { totalOffers: 1 },
            $max: { highestOffer: amount },
            $push: { offers: offer._id },
        });

        req.flash('success', 'Offer made successfully!');
        res.redirect(`/vinyls/${id}`);
    } catch (err) {
        next(err);
    }
};

exports.viewOffers = async (req, res, next) => {
    try {
        const id = req.params.id;

        // populate offers for vinyl
        const vinyl = await Vinyl.findById(id).populate({
            path: 'offers',
            populate: { path: 'buyer', select: 'firstName lastName' },
        });

        if (!vinyl) {
            const err = new Error('Vinyl not found.');
            err.status = 404;
            return next(err);
        }

        if (!vinyl.seller.equals(req.session.user)) {
            const err = new Error('Unauthorized to view offers for this item.');
            err.status = 401;
            return next(err);
        }

        res.render('./offers/offers', {
            cssFile: '/offers/offers.css',
            vinyl: vinyl,
            offers: vinyl.offers,
        });
    } catch (err) {
        next(err);
    }
};

exports.acceptOffer = async (req, res, next) => {
    try {
        const vinylId = req.params.id;
        const offerId = req.params.offerId;
        const user = req.session.user;

        const offer = await Offer.findById(offerId).populate('item');
        if (!offer) {
            const err = new Error('Offer not found.');
            err.status = 404;
            return next(err);
        }

        const vinyl = offer.item;
        if (!vinyl || vinyl._id.toString() !== vinylId) {
            const err = new Error('Vinyl not found.');
            err.status = 404;
            return next(err);
        }

        if (!user) {
            req.flash('error', 'You must be logged in to accept an offer.');
            return res.redirect('/users/login');
        }
        if (!vinyl.seller.equals(user)) {
            const err = new Error('Unauthorized to accept this offer.');
            err.status = 401;
            return next(err);
        }

        // accept offer and make item inactive 
        await Vinyl.findByIdAndUpdate(vinyl._id, { active: false });
        await Offer.findByIdAndUpdate(offerId, { status: 'accepted' });

        // reject other offers on item 
        await Offer.updateMany(
            { item: vinyl._id, _id: { $ne: offerId } },
            { status: 'rejected' }
        );
        res.redirect(`/vinyls/${vinyl._id}/offers`);

    } catch (err) {
        next(err);
    }

};

