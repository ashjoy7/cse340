const pool = require("../database/");

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    return data.rows;
  } catch (error) {
    console.error("getClassifications error " + error);
    return [];
  }
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

/* ***************************
 *  Add new classification
 * ************************** */
async function addNewClassification(classification_name) {
  try {
    const query = "INSERT INTO public.classification (classification_name) VALUES ($1)";
    await pool.query(query, [classification_name]);
    return true;
  } catch (error) {
    console.error("addNewClassification error " + error);
    return false;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addNewInventoryItem(inv_make, inv_model, inv_year, inv_price, classification_id, inv_image_path, inv_thumbnail_path) {
  try {
    const query =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_price, classification_id, inv_image_path, inv_thumbnail_path) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7)";
    await pool.query(query, [inv_make, inv_model, inv_year, inv_price, classification_id, inv_image_path, inv_thumbnail_path]);
    return true;
  } catch (error) {
    console.error("addNewInventoryItem error " + error);
    return false;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addNewClassification,
  addNewInventoryItem
};
