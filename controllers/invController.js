const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res) {
  const invId = req.params.invId;
  const vehicle = await invModel.getVehicleById(inv_id);
  const nav = await utilities.getNav();
  const detailHtml = await utilities.buildVehicleDetail(vehicle);
  res.render("inventory/detail", { title: `${vehicle.inv_make} ${vehicle.inv_model}`, nav, detailHtml });
};

module.exports = invCont