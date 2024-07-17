const pool = require("../database/");

/* ***************************
 *  Count unread messages for account_id
 * ************************** */
async function countUnreadMessages(account_id) {
    try {
        const sql = "SELECT COUNT(*) AS unread_messages FROM public.message WHERE message_to = $1 AND message_read = FALSE";
        const data = await pool.query(sql, [account_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Count Unread Messages Error:", error.message);
        throw new Error("Count Unread Messages Error");
    }
}

/* ***************************
 *  Count archived messages for account_id
 * ************************** */
async function countArchivedMessages(account_id) {
    try {
        const sql = "SELECT COUNT(*) AS archived_messages FROM public.message WHERE message_to = $1 AND message_archived = TRUE";
        const data = await pool.query(sql, [account_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Count Archived Messages Error:", error.message);
        throw new Error("Count Archived Messages Error");
    }
}

/* ***************************
 *  Get inbox by account_id
 * ************************** */
async function getInbox(account_id) {
    try {
        const sql = "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = FALSE ORDER BY message_created DESC";
        const data = await pool.query(sql, [account_id]);
        return data.rows;
    } catch (error) {
        console.error("Get Inbox Error:", error.message);
        throw new Error("Get Inbox Error");
    }
}

/* ***************************
 *  Store message in database
 * ************************** */
async function sendMessage(message_subject, message_body, message_to, message_from, message_created) {
    try {
        const sql = "INSERT INTO public.message (message_subject, message_body, message_created, message_to, message_from) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const result = await pool.query(sql, [message_subject, message_body, message_created, message_to, message_from]);
        
        // Check if the insert was successful
        if (result.rowCount > 0) {
            return result.rows[0]; // Return the inserted message data
        } else {
            throw new Error("Failed to insert message into database.");
        }
    } catch (error) {
        console.error("Send Message Error:", error.message);
        throw new Error("Send Message Error");
    }
}

/* ***************************
 *  Get archives by account_id
 * ************************** */
async function getArchives(account_id) {
    try {
        const sql = "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = TRUE ORDER BY message_created DESC";
        const data = await pool.query(sql, [account_id]);
        return data.rows;
    } catch (error) {
        console.error("Get Archives Error:", error.message);
        throw new Error("Get Archives Error");
    }
}

/* ***************************
 *  Get message data by message_id
 * ************************** */
async function getMessageById(message_id) {
    try {
        const sql = "SELECT * FROM public.message WHERE message_id = $1";
        const data = await pool.query(sql, [message_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Get Message By Id Error:", error.message);
        throw new Error("Get Message By Id Error");
    }
}

/* ***************************
 *  Mark message as read using message_id
 * ************************** */
async function markAsRead(message_id) {
    try {
        const sql = "UPDATE public.message SET message_read = TRUE WHERE message_id = $1 RETURNING *";
        const data = await pool.query(sql, [message_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Mark As Read Error:", error.message);
        throw new Error("Mark As Read Error");
    }
}

/* ***************************
 *  Archive message using message_id
 * ************************** */
async function archiveMessage(message_id) {
    try {
        const sql = "UPDATE public.message SET message_archived = TRUE WHERE message_id = $1 RETURNING *";
        const data = await pool.query(sql, [message_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Archive Message Error:", error.message);
        throw new Error("Archive Message Error");
    }
}

/* ***************************
 *  Delete message using message_id
 * ************************** */
async function deleteMessage(message_id) {
    try {
        const sql = "DELETE FROM public.message WHERE message_id = $1";
        await pool.query(sql, [message_id]);
        return true; // Assuming deletion succeeded
    } catch (error) {
        console.error("Delete Message Error:", error.message);
        throw new Error("Delete Message Error");
    }
}

module.exports = {
    countUnreadMessages,
    countArchivedMessages,
    getInbox,
    sendMessage,
    getArchives,
    getMessageById,
    markAsRead,
    archiveMessage,
    deleteMessage
};
