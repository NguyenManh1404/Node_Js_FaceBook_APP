const express = require('express'); //import
const router = express.Router(); //import
const AuthAdminController = require("../app/controllers/AuthAdminController");

const validator = require("../validation/users");

router.post("/register", AuthAdminController.register);
router.post("/verify", validator.verifyEmail, AuthAdminController.verifyEmail);
router.post("/login", validator.login, AuthAdminController.login);

module.exports = router;
