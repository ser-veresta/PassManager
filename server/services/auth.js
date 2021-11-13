const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const ErrorResponse = require("../utils/errorResponse");

const db = mysql.createConnection({
  user: process.env.DB_NAME,
  host: "remotemysql.com",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.register = ({ username, password, email }, res, next) => {
  db.query("INSERT INTO user (username,email,password) VALUES (?,?,?)", [username, email, password], (err, result) => {
    if (err) {
      return next(err);
    }
    res.send("Account created");
  });
};

exports.login = ({ username, password }, res, next) => {
  db.query(`SELECT id,password FROM user WHERE username='${username}'`, async (err, [data]) => {
    if (err) {
      return next(err);
    }

    if (!data) return next(new ErrorResponse("Invalid credentials", 401));

    const match = await bcrypt.compare(password, data.password);

    if (!match) return next(new ErrorResponse("Invalid credentials", 401));

    const token = jwt.sign({ id: data.id, username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.send(token);
  });
};

exports.getUser = (id, res, next) => {
  db.query(`SELECT id,username,email FROM user WHERE id='${id}'`, (err, [data]) => {
    if (err) {
      return next(err);
    }

    if (!data) return next(new ErrorResponse("User does not exist", 404));

    res.send({ id, username: data.username, email: data.email });
  });
};

exports.forgotPassword = (email, res, next) => {
  const resetToken = crypto.randomBytes(16).toString("hex");
  const resetExpire = moment(new Date(Date.now() + 10 * (1000 * 60))).format("YYYY-MM-DD HH:mm:ss");

  db.query(
    `UPDATE user SET resetPasswordToken='${resetToken}',resetPasswordExpire='${resetExpire}' WHERE email='${email}'`,
    async (err, result) => {
      if (err) {
        return next(err);
      }

      if (!result.changedRows) return next(new ErrorResponse("User not found", 404));

      const resetUrl = `${process.env.CLIENT_URI}/resetPassword/${resetToken}`;

      const message = `
    <h1>You have requested a password reset</h1>
    <p>Please click the link below</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

      try {
        await sendEmail({
          to: email,
          subject: "Password Reset Request",
          text: message,
        });

        res.send("Email Sent");
      } catch (error) {
        return next(new ErrorResponse("Email could not be sent", 500));
      }
    }
  );
};

exports.resetPassword = ({ resetToken, password }, res, next) => {
  db.query(
    `UPDATE user SET resetPasswordToken=NULL,resetPasswordExpire=NULL,password='${password}' WHERE resetPasswordToken='${resetToken}' AND resetPasswordExpire > '${moment().format(
      "YYYY-MM-DD HH-mm-ss"
    )}'`,
    (err, result, fields) => {
      if (err) {
        return next(err);
      }

      if (!result.changedRows) return next(new ErrorResponse("Invalid Token", 400));

      res.send("Password changed");
    }
  );
};
