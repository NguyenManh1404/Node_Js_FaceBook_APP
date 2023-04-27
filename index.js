const express = require("express");
const morgan = require("morgan"); // sử dụng giúp xem được **log** những resquest được gửi lên server.
const routes = require("./src/router"); //import router
const connectDB = require("./src/database/connection"); // import file connectDB
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

require("dotenv").config(); //thư viện để đọc từ ennv

const bodyParser = require("body-parser"); //Lấy được dữ liệu nhập vào (như trong req.body)
const path = require("path");
const app = express();
const multer = require("multer");
const clearImage = require("./src/utils/fileUtil");
const { resources } = require("./admin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadMiddleware = multer({
  storage,
});


(async () => {

  app.use("/public", express.static(path.join(__dirname, "/public")));
  console.log(path.join(__dirname, "/public"));
  //log request on terminal
  app.use(morgan("tiny"));

  //mongodb connection
  await connectDB();
  //parse request to body-parser
  // app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));

  // import load router
  routes(app);

  app.put("/image", uploadMiddleware.single("image"), (req, res, next) => {
    if (!req.file) {
      return res.status(200).json({ message: "No file provided!" });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res.status(201).json({
      message: "File stored.",
      payload: {
        mimetype: req.file.mimetype,
        filename: req.file.filename,
        size: req.size,
      },
    });
  });

  const PORT = process.env.PORT || 3000;

  AdminBro.registerAdapter({ Resource: AdminBroMongoose.Resource, Database: AdminBroMongoose.Database })
  const adminBro = new AdminBro({
    rootPath: '/admin',
    resources: resources,
  })

  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router)
  app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`);
  });
})()