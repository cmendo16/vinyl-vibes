const Item = require('../models/vinyl');
const Offer = require('../models/offer');

// display item in search 
exports.items = async (req, res, next) => {
    try {
        const searchQuery = req.query.search;
        let query = { active: true };

        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i');
            query.$or = [
                { title: regex },
                { details: regex }
            ];
        }

        const vinyls = await Item.find(query).sort({ price: 1 }).populate({ path: 'offers', select: 'amount' });
        res.render('./vinyl/items', { cssFile: 'items.css', vinyls, query: searchQuery });
    } catch (err) {
        next(err);
    }
};

// render ejs file 
exports.new = (req, res) => {
    res.render('./vinyl/new', { cssFile: 'new.css' });
};

// create vinyl posting 
exports.create = async (req, res, next) => {
    try {
        let vinyl = req.body;

        if (req.file) {
            vinyl.image = `/images/${req.file.filename}`;
        }

        vinyl.seller = req.session.user;

        let newVinyl = new Item(vinyl);

        await newVinyl.save();
        req.flash('success', 'Vinyl posted successfully!');
        res.redirect('/vinyls');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(e => e.message);
            req.flash('error', errorMessages);
            return res.redirect('back');
        }
        next(err);
    }
};


// show the vinyl 
exports.show = async (req, res, next) => {
    let id = req.params.id;

    Item.findById(id).populate('seller', 'firstName lastName')
        .then(vinyl => {
            if (vinyl) {
                res.render('./vinyl/item', { cssFile: 'item.css', vinyl });
            } else {
                let err = new Error('Cannot find a vinyl with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// edit vinyl item 
exports.edit = async (req, res, next) => {
    let id = req.params.id;

    Item.findById(id)
        .then(vinyl => {
            res.render('./vinyl/edit', { cssFile: 'edit.css', vinyl });
        })
        .catch(err => next(err));
};

// update vinyl 
exports.update = async (req, res, next) => {

    let vinyl = req.body;
    let id = req.params.id;

    Item.findByIdAndUpdate(id, vinyl, { useFindAndModify: false, runValidators: true })
        .then(vinyl => {
            let updatedVinyl = req.body;

            if (req.file) {
                updatedVinyl.image = `/images/${req.file.filename}`;
            }

            req.flash('success', 'Vinyl posting updated successfully!');
            res.redirect(`/vinyls/${id}`);
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                err.status = 400;
            next(err);
        });
};

exports.delete = async (req, res, next) => {
    let id = req.params.id;

    try {
        const vinyl = await Item.findById(id);

        if (!vinyl) {
            req.flash('error', 'Vinyl not found');
            return res.redirect('/vinyls');
        }

        // delete all offers
        await Offer.deleteMany({ item: id });

        // delete vinyl
        await Item.findByIdAndDelete(id);

        req.flash('success', 'Vinyl posting deleted successfully');
        res.redirect('/vinyls');
    } catch (err) {
        next(err);
    }
};
