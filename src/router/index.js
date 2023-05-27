const authRouter = require("./auth");
const authAdminRouter = require("./auth-admin");

const postRouter = require("./post");
const userRouter = require("./user");
const notificationRouter = require("./notification");
const recipeRouter = require("./recipe");
const favoriteRouter = require("./favorite");
const followerRouter = require('./follower')
const commentRouter = require('./comment')

const UserController = require("../app/controllers/UserController");
const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/auth-admin", authAdminRouter);
  app.use("/api/post", postRouter);
  app.use("/api/notification", notificationRouter);
  app.use("/api/recipe", recipeRouter);
  app.use("/api/favorite", favoriteRouter);
  app.use("/api/user", userRouter);
  app.use("/api/follower", followerRouter);
  app.use("/api/comment", commentRouter);
};

module.exports = routes;
