const express = require("express");
const bcrypt = require("bcrypt");
const protect = require("../middleware/auth");
const { register, login, forgotPassword, checkResetToken, resetPassword, db, getUser } = require("../services/auth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  register({ username, email, password: hashedPassword }, res, next);
});

router.post("/login", (req, res, next) => {
  const user = req.body;

  login(user, res, next);
});

router.post("/forgotPassword", async (req, res, next) => {
  const { email } = req.body;

  forgotPassword(email, res, next);
});

router.post("/resetPassword", async (req, res, next) => {
  const { resetToken, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  resetPassword({ resetToken, password: hashedPassword }, res, next);
});

router.get("/getUser", protect, (req, res, next) => {
  const { id } = req.user;

  getUser(id, res, next);
});

module.exports = router;
