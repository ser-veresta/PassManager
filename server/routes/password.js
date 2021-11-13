const express = require("express");
const crypto = require("crypto");
const { addPassword, showPassword, editPassword, deletePassword, getPasswords } = require("../services/password");

const router = express.Router();

router.post("/addPassword", (req, res, next) => {
  const { password, title, username } = req.body;
  const { username: createdBy } = req.user;

  const iv = Buffer.from(crypto.randomBytes(16));

  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(process.env.ENCRYPT_SECRET), iv);

  const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()]);

  addPassword(
    { createdBy, password: encryptedPassword.toString("hex"), iv: iv.toString("hex"), title, username },
    res,
    next
  );
});

router.get("/", (req, res, next) => {
  const { username } = req.user;

  getPasswords(username, res, next);
});

router
  .route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;

    showPassword(id, res, next);
  })
  .post((req, res, next) => {
    const { id } = req.params;
    const { username, password, title } = req.body;

    const iv = Buffer.from(crypto.randomBytes(16));

    const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(process.env.ENCRYPT_SECRET), iv);

    const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()]);

    editPassword(
      { id, username, password: encryptedPassword.toString("hex"), iv: iv.toString("hex"), title },
      res,
      next
    );
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    deletePassword(id, res, next);
  });

module.exports = router;
