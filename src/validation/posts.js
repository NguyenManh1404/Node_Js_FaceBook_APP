const { check } = require('express-validator');

const post = [
  // check('idUser', 'Id user is required.').notEmpty(),
  check('imagePost', 'Image post is required.').notEmpty(),
  check('contentPost', 'Content post must be at least 2 characters long.').isLength({ min: 2 }),
  check('likePost', 'Like of post is a number and more').isNumeric(),
  check('lovePost', 'Love of post is a number and more').isNumeric(),
  check('commentsPost', 'Comments Post of post is a number').isNumeric(),
  check('statusPost', 'Comments Post of post is a number').isBoolean(),
];

const validator = { post };

module.exports = validator;