const { check } = require('express-validator');

const follwer = [
  // check('idUser', 'Id user is required.').notEmpty(),
  check('idUserFollower', 'Id User follower is required.').notEmpty(),
];

const validator = { follwer };
module.exports = validator;