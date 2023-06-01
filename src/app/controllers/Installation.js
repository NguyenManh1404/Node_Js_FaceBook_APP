const Post = require("../../models/Post");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Installation = require("../../models/Installation");

const InstallationController = {
  // [GET] /api/install
  async detail(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const data = await Installation.find({
        userID: decodedToken,
        tokenDevice: req.body?.tokenDevice,
      });
      res.status(200).json({ msg: "get detail install success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = InstallationController;
