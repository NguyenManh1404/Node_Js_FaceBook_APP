const { check } = require("express-validator");

const recipe = [
  check("name", "Image post is required.").notEmpty(),
  check("linkVideo", "linkVideo is required.").notEmpty(),
  check("images", "Images is required.").isArray(),
  check("categories", "categories is required.").isArray(),
  check("cookTime", "CookTime is a number and more").isNumeric(),
  check("ingredients", "Ingredients is required.").isArray(),
  check("steps", "Steps is required.").isArray(),
];

const validator = { recipe };

module.exports = validator;