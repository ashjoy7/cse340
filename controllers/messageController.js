const utilities = require("../utilities/");
const messageModel = require("../models/message-model");
const accountModel = require("../models/account-model");

/*Inbox build*/
async function buildInboxData(account_id) {
    const account_messages = await messageModel.countArchivedMessages(account_id);
    const archived_messages = account_messages.archived_messages;
    const accountInboxData = await messageModel.getInbox(account_id);
    const inboxTable = await utilities.buildInboxTable(accountInboxData);

    return {
        archived_messages,
        inboxTable
    };
}

async function buildInbox(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const accountData = res.locals.accountData;
        const account_id = accountData.account_id;

        const { archived_messages, inboxTable } = await buildInboxData(account_id);

        const account_name = accountData.account_firstname + " " + accountData.account_lastname;

        res.render("message/inbox", {
            title: `${account_name}'s Inbox`,
            nav,
            errors: null,
            archived_messages,
            inboxTable,
            account_name
        });
    } catch (error) {
        console.error("Error building inbox:", error);
        req.flash("error", "An error occurred while building your inbox.");
        res.redirect("/");
    }
}

/* Build Create Message View */
async function buildCreateMessage(req, res, next) {
    let nav = await utilities.getNav();

    res.render("message/create", {
       title: "New Message",
       nav,
       errors: null
    });
}

/* Send Message */
async function sendMessage(req, res, next) {
    const { message_subject, message_body, message_to, message_from } = req.body;

    try {
        const message_created = new Date().toISOString();

        if (!res.locals.accountData || !res.locals.accountData.account_id) {
            throw new Error('Account data not available.');
        }

        const account_id = res.locals.accountData.account_id;

        // Validate that message_to corresponds to a valid account
        const recipientAccount = await accountModel.getAccountById(message_to);
        if (!recipientAccount || recipientAccount.length === 0) {
            throw new Error('Invalid recipient account ID.');
        }

        // Log incoming message data
        console.log("Incoming Message Data:");
        console.log("Subject:", message_subject);
        console.log("Body:", message_body);
        console.log("To:", message_to);
        console.log("From:", message_from);

        // Call sendMessage method from messageModel
        const sendMessageResult = await messageModel.sendMessage(
            message_subject,
            message_body,
            message_to,
            message_from,
            message_created
        );

        console.log("sendMessageResult:", sendMessageResult);

        if (sendMessageResult !== undefined) {
            req.flash("notice", "Congratulations, your message was sent successfully.");

            const { archived_messages, inboxTable } = await buildInboxData(account_id);

            const account_name = res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname;

            return res.status(201).render("message/inbox", {
                title: `${account_name} Inbox`,
                nav: await utilities.getNav(),
                errors: null,
                archived_messages,
                inboxTable,
                account_name,
                messages: req.flash()
            });
        } else {
            console.error("sendMessageResult is undefined.");
            req.flash("error", "Failed to send message. Please try again.");
            return res.status(500).redirect("/message/create");
        }
    } catch (error) {
        console.error("Error sending message:", error);
        req.flash("error", "An error occurred while sending your message.");
        return res.status(500).redirect("/message/create");
    }
}

/* Deliver archives view */
async function buildArchives(req, res, next) {
    let nav = await utilities.getNav();

    const accountData = res.locals.accountData;
    const account_id = accountData.account_id;

    const account_name = accountData.account_firstname + " " + accountData.account_lastname;

    let accountArchivesData = await messageModel.getArchives(account_id);

    let inboxTable = await utilities.buildInboxTable(accountArchivesData);

    res.render("message/archives", {
      title: account_name + " Archives",
      nav,
      errors: null,
      inboxTable,
      account_name
    });
}

/* Read message view */
async function buildReadMessage(req, res, next) {
    let nav = await utilities.getNav();
    const message_id = parseInt(req.params.message_id);
    const messageData = await messageModel.getMessageById(message_id);

    const timestamp = messageData.message_created;

    const date = new Date(timestamp);

    const message_created = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const senderAccountId = messageData.message_from;
    const accountData = await accountModel.getAccountById(senderAccountId);
    const message_from = accountData[0].account_firstname + " " + accountData[0].account_lastname;
    const message_subject = messageData.message_subject;
    const message_body = messageData.message_body;
    const message_read = messageData.message_read;

    res.render("message/read", {
        title: message_subject,
        nav,
        errors: null,
        message_id,
        message_subject,
        message_created,
        message_from,
        message_body,
        message_read
    });
}

/* Mark as read */
async function markAsRead(req, res, next) {
    const message_id = parseInt(req.params.message_id);

    let nav = await utilities.getNav();

    const markAsReadResult = await messageModel.markAsRead(message_id);

    if (markAsReadResult) {
        req.flash("notice", "The message was successfully marked as read.");
        res.redirect("/message");
    } else {
        req.flash("notice", "Sorry, we could not mark the message as read.");
        res.redirect("/message");
    }
}

/* Archive message */
async function archiveMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id);

    let nav = await utilities.getNav();

    const archiveResult = await messageModel.archiveMessage(message_id);

    if (archiveResult) {
        req.flash("notice", "The message was successfully archived.");
        res.redirect("/message");
    } else {
        req.flash("notice", "Sorry, we could not archive the message.");
        res.redirect("/message");
    }
}

/* Delete Message */
async function deleteMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id);

    let nav = await utilities.getNav();

    const deleteResult = await messageModel.deleteMessage(message_id);

    if (deleteResult) {
        req.flash("notice", "The message was successfully deleted.");
        res.redirect("/message");
    } else {
        req.flash("notice", "Sorry, we could not delete the message.");
        res.redirect("/message");
    }
}

/* Reply View */
async function buildReplyMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id);

    const messageData = await messageModel.getMessageById(message_id);
    const message_subject = "RE: " + messageData.message_subject;
    const message_to = messageData.message_from;

    let nav = await utilities.getNav();

    res.render("message/reply", {
        title: "Reply Message",
        nav,
        errors: null,
        message_id,
        message_subject,
        message_to
    });
}

module.exports = {
    buildInbox, 
    buildCreateMessage, 
    sendMessage, 
    buildArchives, 
    buildReadMessage, 
    markAsRead, 
    archiveMessage, 
    deleteMessage,
    buildReplyMessage
}
