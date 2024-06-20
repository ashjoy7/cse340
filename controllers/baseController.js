const baseController = {};

baseController.buildHome = async function(req, res) {
  try {
    // Example: Fetch navigation data asynchronously
    const nav = await utilities.getNav();

    // Set a flash message
    req.flash("notice", "This is a flash message.");

    // Render the view with data
    res.render("index", { title: "Home", nav });
  } catch (err) {
    console.error(err);
    res.status(500).send('500: Internal Server Error');
  }
}

module.exports = baseController;
