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
  check("phoneNumber", "Invalid mobile number.").isLength({ min: 10, max: 11 }),
  check("phoneNumber", "Invalid mobile number").matches(
    /(84|0[3|5|7|8|9])+([0-9]{8})\b/
  ),
  check("confirmPassword", "Confirm password is required").notEmpty(),
  check(
    "confirmPassword",
    "Confirm password must be at least 6 characters"
  ).isLength({ min: 6 }),
];

const login = [
  check("email", "Email is required").notEmpty(),
  check("email", "Invalid email.").isEmail(),
  check("password", "Password is required").notEmpty(),
];

const verifyEmail = [
  check(
    "emailVerificationCode",
    "Email VerificationCode is required"
  ).notEmpty(),
  check(
    "emailVerificationCode",
    "emailVerificationCode must be at least 6 characters"
  ).isLength({
    min: 6,
  }),
];

//{
//     "firstName": "firstName",
//     "lastName": "lastName",
//     "email": "mah@gmail.com",
//     "password": "1234567",
//     "confirmPassword":"1234567",
//     "phoneNumber":"0949125673"

// }

const validator = { register, login, verifyEmail };

module.exports = validator;
