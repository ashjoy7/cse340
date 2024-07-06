// Require Statements
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Added for cookie parsing
const pool = require('./database/');
const app = express();
const baseController = require('./controllers/baseController');
const static = require("./routes/static")
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const utilities = require('./utilities/'); // Added for utility functions

// Middleware for session and flash messages
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(flash());

// Middleware for parsing cookies
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to make flash messages available in all views
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

// View Engine and Layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Static files
app.use(static);

// Serve CSS files from the public/css folder
const directoryPath = __dirname;
app.use('/css', express.static(directoryPath + '/public/css'));

// Serve images from the public/images folder
app.use('/public/images', express.static(directoryPath + '/public/images'));

// Local Server Information
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`App is listening on http://${host}:${port}`);
});

// Index route
app.get('/', baseController.buildHome);

// Inventory routes
app.use('/inv', inventoryRoute);

// Account routes
app.use('/account', accountRoute);

// Handle 404 errors
app.use(function(req, res, next) {
  res.status(404).send('404: Page not Found');
});

// Handle server errors
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('500: Internal Server Error');
});
