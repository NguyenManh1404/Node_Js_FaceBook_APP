const User = require("../../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // thư viện để Hash password
const JWT = require("jsonwebtoken"); // thư viện để create token
const transporter = require("../../../config/nodemailler");
const passport = require("passport");
const Installation = require("../../models/Installation");

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
          errors: [{ email: user.email, message: "The user already exist" }],
        });
      }

      //Check password with confirmPassword
      if (password !== confirmPassword) {
        return res.status(401).json({
          errors: [{ message: "Confirm password not match" }],
        });
      }

      // Hash password before saving to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Generate 6 code
      const generateVerificationCode = () => {
        const code = Math.floor(Math.random() * 900000) + 100000;
        return code.toString();
      };
      const emailVerificationCode = generateVerificationCode();

      // Date user
      const data = {
        firstName,
        lastName,
        email,
        emailVerificationCode,
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

      const mailOptions = {
        from: "MasterMeal Team",
        to: email,
        subject: "MasterMeal - Verify email",
        template: "verify-email",
        context: {
          firstName: firstName,
          emailVerificationCode,
        },
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error.message);
          return res
            .status(500)
            .json({ errors: [{ message: "Internal server error" }] });
        } else {
          return res.json({
            message: `We have sent a verify email link to ${email}`,
          });
        }
      });
      //res
      return res
        .status(200)
        .json({ data: newUser, message: "Registered an account successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },
  // [POST] /api/auth/verify
  async verifyEmail(req, res) {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, emailVerificationCode, isFromForgotPassword } = req?.body;

      const user = await User.findOne({
        email: email,
        emailVerificationCode: emailVerificationCode,
      });

      if (user) {
        await User.findByIdAndUpdate(user.id, {
          isEmailVerified: true,
        });

        return res.status(200).json({
          data: {
            user: user,
            isFromForgotPassword: isFromForgotPassword || false,
          },
          message: "Verify account successfully",
        });
      } else {
        return res.status(401).json({
          errors: [{ message: "Mail verification code or Email is not match" }],
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },

  async checkUserMatch(email, password) {
    try {
      const user = await User.findOne({ email });

      // user not found
      if (!user) {
        throw new Error("user is not exist");
      }

      // Compare hased password with user password to see if they are valid
      const isMatch = await bcrypt.compareSync(password, user.password);

      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
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
        return res
          .status(400)
          .json({ errors: [{ message: "User do not exist" }] });
      }

      if (user.status === false) {
        return res.status(400).json({ errors: [{ message: "User is block" }] });
      }

      // Compare hased password with user password to see if they are valid
      const isMatch = await bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ message: "Email or password is invalid" }] });
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

      let installation = {};
      let device = {};
      // let checkExistDevice = {}
      const checkExistDevice = await Installation.find({
        userID: user.id,
        tokenDevice: req.body?.tokenDevice,
      });

      if (checkExistDevice.length == 0) {
        installation = await new Installation({
          userID: user.id,
          tokenDevice: req.body?.tokenDevice,
        });

        await installation.save();
        device = installation;
      }

      if (checkExistDevice.length > 0) {
        checkExistDevice.map((value) => {
          device = value;
        });
      }

      return res.json({
        user,
        accessToken,
        refreshToken,
        device,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error" }] });
    }
  },

  // [POST] /api/auth/requestCodeVerifyEmail
  async requestCodeVerifyEmail(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      // User not found
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: "User not registered" }] });

      const mailOptions = {
        from: "MasterMeal Team",
        to: email,
        subject: "MasterMeal - Verify email",
        template: "verify-email",
        context: {
          firstName: user?.firstName,
          emailVerificationCode: user?.emailVerificationCode,
        },
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error.message);
          return res
            .status(500)
            .json({ errors: [{ message: "Internal server error" }] });
        } else {
          return res.json({
            message: `We have sent a verify email link to ${email}`,
            email: email,
          });
        }
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error" }] });
    }
  },

  // [POST] /api/auth/reset-password
  async resetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { password, confirmPassword, email } = req.body;

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ errors: [{ message: "Confirm password not match" }] });

    try {
      // Hash password before saving to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.findOne({ email });
      // User not found
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ message: "User not found" }] });

      await User.findByIdAndUpdate(user?.id, { password: hashedPassword });

      return res.json({
        message: "Password was reset successfully",
        data: user,
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error" }] });
    }
  },

  async loginSimple(req, res) {
    const defaultUser = {
      email: "manh@gmail.com",
      password: "manh123",
    };

    try {
      const { password, email } = req.body;

      // user not found
      if (email !== defaultUser?.email) {
        return res
          .status(200)
          .json({ errors: { message: "User do not exist" } });
      }
      // password is not match
      if (password !== defaultUser?.password) {
        return res
          .status(200)
          .json({ errors: { message: "Password is not match" } });
      }

      return res.status(200).json({
        data: {
          users: defaultUser,
          message: "Login successful",
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ errors: { message: "Internal server error" } });
    }
  },

  //   async loginFacebook(req, res) {
  // try {
  //    const { email, password } = req.body;

  // } catch (error) {

  // }
  // },

  async getAuth(req, res) {
    // passport.authenticate('EAAHdkS0ZBDKEBAMvbpMLIAuRfefTge5PdHVZChAh5GNZAwLEcoETnOfD7smJERePZANWHNwJznqoB6RBqsD9cM69cbe5lIzJIPAe8Q8EAEfrAQTArZB3TpNHYrAocx2gOaoge30IV9XHUirToh5uEqeTZBWgedGdTJks3pyBPzHkuhLdGwYC9fEqNPf3VLgKsXWJsZCdZCLkF2YBwU5N7zQlhCPnZCh52xseYZCMtu4cEL0eltkuPn0lta', (error, user, info) => {
    //   console.log("🚀 ~ file: AuthController.js:207 ~ passport.authenticate ~ user:", user)
    //   if (error) {
    //     resolve(error);
    //   }

    //   resolve(user);
    // })(request);

    // const mailOptions = {
    //   from: "MasterMeal Team",
    //   to: "tuongmynga@gmail.com",
    //   subject: "MasterMeal - Verify email",
    //   template: "verify-email",
    //   context: {
    //     firstName: "Manh Nguyen",
    //   },
    // };

    // await transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.error(error.message);
    //     return res
    //       .status(500)
    //       .json({ errors: [{ message: "Internal server error" }] });
    //   } else {
    //     return res.json({
    //       message: `We have sent a verify email link to ${email}`,
    //     });
    //   }
    // });

    return res.json({ name: "Hug Manh", password: "i love you" });
  },
};

module.exports = AuthController;
