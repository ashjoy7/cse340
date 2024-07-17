const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid
  if(data.length > 0){
    let vehicle =data[0]
    grid = '<div class="detail_body">'
      grid += '<div><img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors" /></div>'
      grid += '<div class="vehicle_info">'
      grid += '<h2 id="vehicle_title">'  + vehicle.inv_make + ' ' + vehicle.inv_model +  '</h2>'
      grid += '<p>' + vehicle.inv_description + '</p>'
      grid += '<p>' + vehicle.inv_year + '</p>'
      grid += '<p>' + vehicle.inv_miles + '</p>'
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/******************************************
 * build dynamic select classification
 * ****************************************/

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
  '<select name="classification_id" id="classificationList">'
  classificationList += "<option>Choose a Classifiaction</option>"
  data.rows.forEach((row)=> {
      classificationList += '<option value="' + row.classification_id + '"'
          if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected "
          }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     } 
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     res.locals.access = false
     if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
      res.locals.access = true;
  }
 
     next();
    })
  } else {
   next();
  }
 };

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAccess = (req, res, next) => {
  if (res.locals.access) {
    next()
  } else {
    req.flash("notice", "ACCESS DENIED")
    return res.redirect("/account/login")
  }
 }

 Util.getAdditional = async function (account_type) {
  let section = ""
  if (account_type === "Admin" || account_type === "Employee") {
    section += "<h3>Inventory Managment</h3>";
    section += `<a href="../inv/management" title="Manage Inventory Items">Manage Inventory Items</a>`;
  }
  return section
 }

/* ************************
 * Constructs the inbox with the data passed in
 ************************** */
Util.buildInboxTable = async function (data) {
  let inboxTable = '';

  if (data && data.length > 0) {
      inboxTable += '<table id="inboxDisplay">';
      inboxTable += '<thead>';
      inboxTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>';
      inboxTable += '</thead>';
      inboxTable += '<tbody>';
      
      await Promise.all(data.map(async (element) => {
          const timestamp = element.message_created;
          const date = new Date(timestamp);
          const formattedTimestamp = date.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
          });

          const message_id = element.message_id;
          const message_from = element.message_from;

          const accountData = await accountModel.getAccountById(message_from);
          const messageSenderName = accountData[0].account_firstname + " " + accountData[0].account_lastname;

          inboxTable += `<tr><td>${formattedTimestamp}</td><td><a href="/message/read/${message_id}">${element.message_subject}</a></td><td>${messageSenderName}</td><td>${element.message_read}</td></tr>`;
      }));

      inboxTable += '</tbody>';
      inboxTable += '</table>';
  } else {
      inboxTable += '<p class="notice">No messages available.</p>'; // Changed message here
  }

  return inboxTable;
};




module.exports = Util
