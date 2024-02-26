const cloudinary = require("cloudinary").v2;
const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

cloudinary.config({
  cloud_name: "imagedemo",
  api_key: "355361697886157",
  api_secret: "EwaBetpuqxj3WZ8Jyqruq7lkZu4",
});




const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


// const storage = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ["jpg", "png"],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const uploadCloud = multer({ storage });

module.exports = { cloudinary , upload};
