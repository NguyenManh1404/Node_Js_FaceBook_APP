const authRouter = require("./auth");

const postRouter = require("./post");
const notificationRouter = require("./notification");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/post", postRouter);
  app.use("/api/notification", notificationRouter);
};

module.exports = routes;