// Require Statements
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Added for cookie parsing
const path = require('path'); // Import path module
const pool = require('./database/');
const app = express();
const baseController = require('./controllers/baseController');
const static = require("./routes/static");
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

// Middleware for parsing cookies
app.use(cookieParser());

// Parse application/json
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware to apply JWT token
app.use(utilities.checkJWTToken);

app.use(flash());

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
app.use('/css', express.static(path.join(directoryPath, '/public/css')));

// Serve images from the public/images folder
app.use('/public/images', express.static(path.join(directoryPath, '/public/images')));

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

// Error handling middleware
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404 || err.status == 500) {
    message = err.message;
  } else {
    message = 'Whoops, something went wrong...';
  }
  res.render('errors/error', { 
    title: err.status || 'Server Error', 
    message, 
    nav 
  });
});

// Local Server Information
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`App is listening on http://${host}:${port}`);
});
