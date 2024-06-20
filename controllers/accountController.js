const utilities = require('../utilities/index');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('account/login', {
      title: 'Login',
      nav,
      messages: req.flash('notice')
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process login attempt
 * *************************************** */
async function processLogin(req, res, next) {
  try {
    // Assume some login logic here
    const { email, password } = req.body;

    // Simulate a login failure
    if (email !== 'test@example.com' || password !== 'password') {
      req.flash('notice', 'Invalid email or password.');
      return res.redirect('/account/login');
    }

    // Simulate a successful login
    req.flash('notice', 'Successfully logged in!');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

module.exports = { buildLogin, processLogin };
