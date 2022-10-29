# Cách sử dụng node js để tạo một server

## Khởi tạo:

1. **yarn init**: khởi tạo file **package.json**;
2. **yarn add express**: cài đặt thư viện **express**;
3. Tạo file **index.js** cùng cấp với **package.json**;
4. Dán đoạn code này vào: **index.js**;

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

5. **node index.js** Chạy thử server lên;
6. **yarn add nodemon**: cài thư viện này giúp tự động restart lại app khi có sự thay đổi trong dự án
7. Thêm đoạn code này vào sửa **package.json**

```js
  "scripts": {
    "start": "nodemon index.js"
  },
```

8. **yarn start** : Chạy server thông qua thư viện **nodemon** , bây giờ khi thay đổi file bất kỳ trong dự án thì sẽ tự động refresh lại server.
9. **yarn add morgan** : Cài đặt thư viện này giúp xem được **log** những resquest được gửi lên server.

- Sau đó import vào và sử dụng:

```js
const express = require("express");
const morgan = require("morgan"); // here
const app = express();
const port = 3000;

app.use(morgan("tiny")); // here

app.get("/", (req, res) => {
  res.send("Hello Worlf!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## Chỉnh lại cấu trúc thư mục

1. Tạo thư mục **src**: cùng cấp với **node_modules**:
2. Chỉnh sửa lại file **package.json**

```js
  {
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js", // here
  "author": "hungmanh",
  "license": "MIT",
  "scripts": {
    "start": "nodemon index.js" // here
  },
  "dependencies": {
    "express": "4.18.1",
    "morgan": "^1.10.0",
    "nodemon": "2.0.16"
  }
}
```

4. Tạo thư mục **app** trong **src** cùng cấp với thư mục**app** : trong đó sẽ chứa các thư mục sau: **controllers** ,**middleware**,..
5. Tạo thư mục: **model** trong **src** cùng cấp với thư mục**app**: trong đó sẽ chứa file **model.js** sẽ chứa các **schema**
6. Tạo thư mục: **router** trong **src** cùng cấp với thư mục**app**: trong đó sẽ chứa file **router.js**
7. Tạo thư mục: **database** trong **src** cùng cấp với thư mục**app**: trong đó sẽ chứa file **connection.js**
   ![forEachResult](./image/structproject.png)

## Thay đổi router

1. Chỉnh sửa file **index.js**

```js
const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3001;

app.use(morgan("tiny"));

//load router
app.use("/", require("./src/router/router")); //here di chuyển route qua một file riêng để import vào.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

2. Thêm file **router.js** trong thư mục **router**

```js
const express = require("express"); //import
const router = express.Router(); //import

router.get("/api/home", (req, res) => {
  res.status(200).send({ message: "Hello word" });
});

module.exports = router;
```

## Tiến hành setup database với mongoose

1. **yarn add mongoose** : Cài đặt thư viện **mongoose** để kết nối với **clound mongose**;
2. Chỉnh sửa file **connection.js** trong thư mục **database**;

- Dán code này vào

  ```js
  const mongoose = require("mongoose");

  const connectDB = async () => {
    try {
      //chuỗi kết nối
      const con = await mongoose.connect(process.env.MONGO_URI, {
        // here chỗ này import từ env config file
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useFindAndModify: false,
        //useCreateIndex: true,
      });

      console.log("Kết nối MongoDB thành công !!!");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };

  module.exports = connectDB;
  ```

3. **yarn add dotenv**: cài đặt thư viện **dotenv** để config các đường dẫn và port. nâng tính bảo mật và dễ quản lý;

- Tạo file **.env** cùng cấp với **package.json** và **index.js**

```js
PORT=3001
MONGO_URI= //here uri mogodb
```

- chỉnh sửa **index.js**

```js
const express = require("express");
const morgan = require("morgan");
require("dotenv").config(); // here import dotenv
const app = express();

const port = process.env.PORT; //here collect port from .env file

app.use(morgan("tiny")); // sử dụng giúp xem được **log** những resquest được gửi lên server.

app.use("/", require("./src/router/router")); // import load router

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## Tiến hành xử lý file model

1. Tạo các model trong thư mục **model** ;

```js
const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    imagePost: {
      type: String,
      required: true,
    },
    contentPost: {
      type: String,
      required: true,
    },
    likePost: {
      type: Number,
      min: 0,
    },
    lovePost: {
      type: Number,
      min: 0,
    },
    commentsPost: {
      type: Number,
      min: 0,
    },
    statusPost: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("post", schema);
```

## Setup cloudinary

1. **yarn add cloudinary**: Create đặt thư viện
2. Thêm những key vào .env
3. 