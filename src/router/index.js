const authRouter = require("./auth");

const postRouter = require("./post");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/post", postRouter);
  app.use("/", (req, res) => res.render("index"));
};

module.exports = routes;