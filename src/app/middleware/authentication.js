const JWT = require("jsonwebtoken");

const authentication = {

  async verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1]; // Bearer Token

    // If token not found in the Authorization header, check the adminbro cookie
    if (!token) {
      const cookieHeader = req?.headers?.cookie;
      if (cookieHeader) {
        const cookies = cookieHeader.split(';');

        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();

          // Check if the cookie starts with the desired name
          if (cookie.startsWith('adminbro=')) {
            // Extract the cookie value
            token = cookie.substring('adminbro='.length);
            break;
          }
        }
      }
    }

    // If token still not found, send error message
    if (!token) {
      return res.status(401).json({ errors: [{ msg: "Token not found" }] });
    }

    // Authenticate token
    try {
      const user = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      next();
    } catch (error) {
      console.error(error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(200).json({ code: 401, msg: error.message });
      }
      return res.status(403).json({ errors: [{ msg: "Internal server error" }] });
    }
  }

  ,

  async verifyRefreshToken(req, res, next) {
    const { refreshToken } = req.body;
    // If token not found, send error message
    if (!refreshToken)
      return res
        .status(401)
        .json({ errors: [{ msg: "Refresh token not found" }] });
    // Authenticate token
    try {
      const user = await JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      req.user = user;
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(403).json({ errors: [{ msg: "Invalid token" }] });
    }
  },
};

module.exports = authentication;
