const authRouter = require("./auth");

const routes = (app) => {
  app.use("/api/auth", authRouter);
};

module.exports = routes;