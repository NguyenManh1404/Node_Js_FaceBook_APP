const authRouter = require("./auth");

const postRouter = require("./post");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/post", postRouter);
};

module.exports = routes;