const express = require('express'); //import
const router = express.Router(); //import

// const PostController = require('../app/controllers/PostController')
// const uploadCloud = require("../../config/cloudinary");

const AuthController = require("../app/controllers/AuthController");

const validator = require("../validation/users");

// router.post('/api/upload', uploadCloud.single('file'), PostController.store);
router.post("/register", validator.register, AuthController.register);

module.exports = router;
