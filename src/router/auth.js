const express = require('express'); //import
const router = express.Router(); //import

// const PostController = require('../app/controllers/PostController')
// const uploadCloud = require("../../config/cloudinary");

const AuthController = require("../app/controllers/AuthController");

const validator = require("../validation/users");

router.post("/register", validator.register, AuthController.register);
router.post("/verify", validator.verifyEmail, AuthController.verifyEmail);
router.post("/login", validator.login, AuthController.login);
router.get("/getAuth", AuthController.getAuth);

module.exports = router;
