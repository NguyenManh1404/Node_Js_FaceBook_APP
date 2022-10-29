const { check } = require("express-validator");

const register = [
  check("firstName", "First Name user is required.").notEmpty(),
  check("firstName", "First name must be at least 2 characters").isLength({
    min: 2,
  }),
  check("lastName", "Last name is required").notEmpty(),
  check("lastName", "Last name must be at least 2 characters").isLength({
    min: 2,
  }),
  check("email", "Email is required").notEmpty(),
  check("email", "Invalid email.").isEmail(),
  check("password", "Password is required").notEmpty(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  check("phoneNumber", "Invalid mobile number.").notEmpty(),
    // .isLength({ min: 11, max: 11 }),
    // .matches(/^(09|\+639)\d{9}$/),
  check("confirmPassword", "Confirm password is required").notEmpty(),
  check(
    "confirmPassword",
    "Confirm password must be at least 6 characters"
  ).isLength({ min: 6 }),
];
//{
//     "firstName": "firstName",
//     "lastName": "lastName",
//     "email": "mah@gmail.com",
//     "password": "1234567",
//     "confirmPassword":"1234567",
//     "phoneNumber":"0949125673"

// }

const validator = { register };

module.exports = validator;
