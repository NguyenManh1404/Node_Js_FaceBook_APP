const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    //chuỗi kết nối
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true
    })
  } catch (err) {
    console.log("Error", err);
    process.exit(1);
  } finally {
    console.log("Kết nối MongoDB thành công !!!");
  }
}

module.exports = connectDB;