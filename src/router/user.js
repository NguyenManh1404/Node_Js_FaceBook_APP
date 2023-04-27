const express = require('express'); //import
const router = express.Router(); //import
const UserController = require("../app/controllers/UserController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.get("/", verifyAccessToken, UserController.list);


module.exports = router;