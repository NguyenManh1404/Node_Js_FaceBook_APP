const express = require("express"); //import
const router = express.Router(); //import


const NotificationController = require("../app/controllers/NotificationController");

const validator = require("../validation/users");

router.get("/pushNotification", NotificationController.getNotification);

module.exports = router;
