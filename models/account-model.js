const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
      const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
      return result.rows[0]; // Assuming you want to return the inserted row
    } catch (error) {
      throw error; // Throw the error to be caught by the caller
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount; // Return the number of rows found
  } catch (error) {
    return error.message; // Return error message if query fails
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail // Add the new function to exports
};
