/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
//Index route
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})

//Static files
app.use(express.static('public'))

// Serve CSS files from the public/css folder
const directoryPath = __dirname;
app.use('/css', express.static(directoryPath + '/public/css'));

// Serve images from the public/images folder
app.use('/images', express.static(directoryPath + '/public/images'));
