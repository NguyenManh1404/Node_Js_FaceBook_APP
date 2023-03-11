const User = require("../../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // thư viện để Hash password
const JWT = require("jsonwebtoken"); // thư viện để create token

const AuthController = {
  // [POST] /api/auth/register
  async register(req, res) {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        avatar,
        position,
        address,
        region,
      } = req?.body;

      // Validate if user already exist
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(409).json({
          errors: [{ email: user.email, msg: "The user already exist" }],
        });
      }

      //Check password with confirmPassword
      if (password !== confirmPassword) {
        return res.status(401).json({
          errors: [{ msg: "Confirm password not match" }],
        });
      }

      // Hash password before saving to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Date user
      const data = {
        firstName,
        lastName,
        email,
        phoneNumber,
        avatar,
        position,
        address,
        region,
        password: hashedPassword,
      };

      // Add into data
      const newUser = new User(data);
      await newUser.save();
      // const secret = process.env.ACCESS_TOKEN_SECRET
      // const token = JWT.sign({ email }, secret, { expiresIn: "10m" });
      //res
      return res
        .status(200)
        .json({ msg: "Registered an account successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal server error", error }] });
    }
  },

  // [POST] /api/auth/login

  async login(req, res) {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      // user not found
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User do not exist" }] });
      }

      // Compare hased password with user password to see if they are valid
      const isMatch = await bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Email or password is invalid" }] });
      }

      //Colet filed to add into token
      const { _id, firstName, lastName } = user;

      // Send JWT access token
      const accessToken = await JWT.sign(
        { id: _id, firstName, lastName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );

      // Refresh token
      const refreshToken = await JWT.sign(
        { id: _id, firstName, lastName },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({ user, accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal server error" }] });
    }
  },

  async getAuth(req, res) {
    return res.json({ name: "Hug Manh", password: "i love you" });
  },
};

module.exports = AuthController;
