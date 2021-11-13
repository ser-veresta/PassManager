const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new ErrorResponse(message, 401);
  }

  if (err.message === "jwt expired") {
    const message = "Session expired, please login again";
    error = new ErrorResponse(message, 401);
  }

  if (err.code === "ER_DUP_ENTRY") {
    let message = "Username or Email already exits";

    if (err.message.includes("email_UNIQUE")) {
      message = "Email already exits";
    }

    if (err.message.includes("username_UNIQUE")) {
      message = "Username already exits";
    }

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    errorObj: { ...err },
  });
};

module.exports = errorHandler;
