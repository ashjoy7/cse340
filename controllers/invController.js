const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classification_Id;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (!data || data.length === 0) {
        // Handle the case where no data is returned
        let nav = await utilities.getNav();
        res.render("./inventory/classification", {
            title: "No vehicles found",
            nav,
            grid: '<p class="notice">Sorry, no matching vehicles could be found.</p>',
        });
        return;
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res) {
    const invId = req.params.invId;
    const vehicle = await invModel.getVehicleById(invId);
    if (!vehicle) {
        // Handle the case where no vehicle is found
        let nav = await utilities.getNav();
        res.render("./inventory/detail", {
            title: "Vehicle not found",
            nav,
            detailHtml: '<p class="notice">Sorry, the vehicle could not be found.</p>',
        });
        return;
    }
    const nav = await utilities.getNav();
    const detailHtml = await utilities.buildVehicleDetail(vehicle);
    res.render("inventory/detail", { title: `${vehicle.inv_make} ${vehicle.inv_model}`, nav, detailHtml });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash('notice')
    });
};

module.exports = invCont;
