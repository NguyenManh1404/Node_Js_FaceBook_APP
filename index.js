const express = require('express');
const morgan = require('morgan'); // sử dụng giúp xem được **log** những resquest được gửi lên server.
const routes = require("./src/router"); //import router
const connectDB = require('./src/database/connection'); // import file connectDB
require("dotenv").config(); //thư viện để đọc từ ennv

const bodyParser = require("body-parser"); //Lấy được dữ liệu nhập vào (như trong req.body)



const app = express();
//log request on terminal  
app.use(morgan('tiny'));

//mongodb connection
connectDB();

//parse request to body-parser
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// import load router
routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})

