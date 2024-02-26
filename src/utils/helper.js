const express = require('express');
const { cloudinary, upload } = require("../../config/cloudinary");
const router = express.Router();

const uploadImageToCloud = (req, res) => {
  router.post("/upload", upload.single("image"), function () {
      console.log("vaof day");
    cloudinary.uploader.upload(
      req.file.path,
      { folder: "FacbookApp" },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }

        res.status(200).json({
          success: true,
          message: "Uploaded!",
          data: result,
        });
      }
    );
  });
};

module.exports = { uploadImageToCloud };
