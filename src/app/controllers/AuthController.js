const User = require("../../models/User");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // thư viện để Hash password


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

  //GET api/auth/get_per_page

  getPerPage(req, res) {
    const apiUrl = "https://6514fb42dc3282a6a3cdb0e1.mockapi.io/users";

    // Make a GET request to the API using fetch
    fetch(apiUrl)
      .then((response) => {
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Handle the data
        console.log(data);

        const { page, perPage } = req?.body;
        // console.log(
        //   "🚀 ~ file: AuthController.js:96 ~ .then ~ page:",
        //   page,
        //   perPage
        // );

        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;

        const paginatedData = data.slice(startIndex, endIndex);

        //res
        return res.status(200).json({
          msg: "Get  successfully",
          items: paginatedData,
          page: page,
          perPage: perPage,
          totalItem: data?.length
        });
       
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ errors: [{ msg: "Internal server error", error }] });
      });
  },
};

module.exports = AuthController;
