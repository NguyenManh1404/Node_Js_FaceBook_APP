const Admin = require("../../models/Admin");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // thư viện để Hash password
const JWT = require("jsonwebtoken"); // thư viện để create token
const transporter = require("../../../config/nodemailler");
const passport = require("passport");

const AuthAdminController = {
  // [POST] /api/auth-admin/register
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

      // Validate if admin already exist
      const admin = await Admin.findOne({ email: email });
      if (admin) {
        return res.status(409).json({
          errors: [{ email: admin.email, message: "The admin already exist" }],
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

      // Date admin
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
      const newAdmin = new Admin(data);
      await newAdmin.save();
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
        .json({ data: newAdmin, message: "Registered an account successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },
  // [POST] /api/auth-admin/verify
  async verifyEmail(req, res) {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, emailVerificationCode } = req?.body;

      const admin = await Admin.findOne({
        email: email,
        emailVerificationCode: emailVerificationCode,
      });

      if (admin) {
        await Admin.findByIdAndUpdate(admin.id, {
          isEmailVerified: true,
        });

        return res
          .status(200)
          .json({ data: admin, message: "Verify account successfully" });
      } else {
        return res
          .status(200)
          .json({ message: "Mail verification code or Email is not match" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },

  async checkAdminMatch(email, password) {
    try {
      const admin = await Admin.findOne({ email: email });

      // user not found
      if (!admin) {
        return res
          .status(400)
          .json({ errors: [{ message: "Admin do not exist" }] });
      }

      // Compare hased password with user password to see if they are valid
      const isMatch = await bcrypt.compareSync(password, admin.password);

      if (!isMatch) {
        return admin;
      }
    } catch (error) {
      return null;
    }
  },

  // [POST] /api/auth-admin/login
  async login(req, res) {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email });

      // Admin not found
      if (!admin) {
        return res
          .status(400)
          .json({ errors: [{ message: "Admin do not exist" }] });
      }

      // Compare hased password with user password to see if they are valid
      const isMatch = await bcrypt.compareSync(password, admin.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ message: "Email or password is invalid" }] });
      }

      //Colet filed to add into token
      const { _id, firstName, lastName } = admin;

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

      return res.json({ admin, accessToken, refreshToken });
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error" }] });
    }
  },
};

module.exports = AuthAdminController;
