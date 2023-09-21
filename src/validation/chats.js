const { check } = require("express-validator");

const chat = [
  check("idUserSend", "idUserSend user is required.").notEmpty(),
  check("content", "Content post must be at least 2 characters long.").isLength(
    { min: 2 }
  ),
  check("statusPost", "Comments Post of post is boolean").isBoolean(),
];

const validator = { chat };

module.exports = validator;
