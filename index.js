const express = require('express');
const morgan = require('morgan'); // sử dụng giúp xem được **log** những resquest được gửi lên server.
const routes = require("./src/router"); //import router
const connectDB = require('./src/database/connection'); // import file connectDB
const cors = require("cors");
require("dotenv").config(); //thư viện để đọc từ env

const bodyParser = require("body-parser"); //Lấy được dữ liệu nhập vào (như trong req.body)
const formData = require("express-form-data"); //TEST FORM DATA
const os = require("os"); //TEST FORM DATA

const app = express();
//log request on terminal    
app.use(morgan('tiny'));

app.use(cors());
//mongodb connection
connectDB();

//parse request to body-parser
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Parse URL-encoded bodies using qs library
app.use(bodyParser.json({ limit: "50mb" }));


//TEST FORM DATA
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());
//TEST FORM DATA

// import load router
routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})

