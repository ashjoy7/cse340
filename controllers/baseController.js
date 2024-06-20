const utilities = require("../utilities/");

const baseController = {};

baseController.buildHome = async function(req, res) {
  try {
    const nav = await utilities.getNav();
    req.flash("notice", "This is a flash message."); // Set the flash message

    // Fetch all types of flash messages and pass to views
    const messages = req.flash();
    
    // Render the view with data
    res.render("index", { title: "Home", nav, messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('500: Internal Server Error');
  }
}

module.exports = baseController;
