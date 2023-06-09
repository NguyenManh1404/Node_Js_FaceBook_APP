const authRouter = require("./auth");

const postRouter = require("./post");
const userRouter = require("./user");
const notificationRouter = require("./notification");
const recipeRouter = require("./recipe");
const favoriteRouter = require("./favorite");
const followerRouter = require("./follower");
const commentRouter = require("./comment");
const installRouter = require("./install");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/post", postRouter);
  app.use("/api/notification", notificationRouter);
  app.use("/api/recipe", recipeRouter);
  app.use("/api/favorite", favoriteRouter);
  app.use("/api/user", userRouter);
  app.use("/api/follower", followerRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/install", installRouter);
};

module.exports = routes;
