const pool = require("../database/");

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  return pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE classification_id = $1", [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    return [];
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(invId) {
  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [invId]);
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById
};
