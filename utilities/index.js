const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let navItems = [];
  navItems.push({ link: "/", name: "Home" });
  data.rows.forEach((row) => {
    navItems.push({
      link: "/inv/type/" + row.classification_id,
      name: row.classification_name
    });
  });
  return navItems;
}

/* ************************
 * Constructs the vehicle detail HTML
 ************************** */
Util.buildVehicleDetail = function (vehicle) {
  let detailHtml = `<div class="vehicle-detail">
                      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
                      <div class="vehicle-info">
                        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
                        <p>Year: ${vehicle.inv_year}</p>
                        <p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
                        <p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
                        <p>Description: ${vehicle.inv_description}</p>
                      </div>
                    </div>`;
  return detailHtml;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

module.exports = Util;
