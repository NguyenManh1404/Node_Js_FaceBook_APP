const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../../public", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
module.exports = clearImage;
