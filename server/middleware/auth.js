const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const protect = (req, res, next) => {
  let token;

  if (req.headers.token) {
    token = req.headers.token.split(" ")[1];
  }

  if (!token) return next(new ErrorResponse("Not Authorized", 401));

  try {
    const { id, username } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id, username };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
