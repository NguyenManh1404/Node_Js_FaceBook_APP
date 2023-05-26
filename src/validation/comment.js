const { check } = require('express-validator');

const comment = [
  check('idUser', 'Id user is required.').notEmpty(),
  check('idPost', 'Id Post is required.').notEmpty(),
  check('content', 'Id Post is required.').notEmpty(),
];

const validator = { comment };
module.exports = validator;