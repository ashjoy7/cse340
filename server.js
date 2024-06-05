/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const staticRoute = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute"); // Add this line

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root
app.use(staticRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

// Index route
app.get("/", (req, res) => {
  baseController.buildHome(req, res);
  res.render("index", { title: "Home" });
});

// Inventory routes
app.use("/inv", inventoryRoute);

// Static files
app.use(express.static('public'));

// Serve CSS files from the public/css folder
const directoryPath = __dirname;
app.use('/css', express.static(directoryPath + '/public/css'));

// Serve images from the public/images folder
app.use('/images', express.static(directoryPath + '/public/images'));
