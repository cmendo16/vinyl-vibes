const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const vinylRoutes = require('./routes/vinylRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create the app
const app = express();

//configure the app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs'); // setting our view 
mongoURI = 'mongodb+srv://cmendosalazn22:8UTFOIiJCBoYLTqC@mydb.nji1g.mongodb.net/project5?retryWrites=true&w=majority&appName=MyDB'

// connect to the database 
mongoose.connect(mongoURI)
    .then(() => {
        //start the server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));

// mount middleware
app.use(
    session({
        secret: "ajfkdljfjkrjfjkfs88",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongoUrl: mongoURI }),
        cookie: { maxAge: 60 * 60 * 1000 }
    })
);

app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));


// set up the routes 
app.get('/', (req, res) => {
    res.render('index', { cssFile: 'index.css' });
})


app.use('/vinyls', vinylRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url)
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = "Internal Server Error";
    }

    res.status(err.status);
    res.render('error', { error: err, cssFile: 'error.css' });
});


