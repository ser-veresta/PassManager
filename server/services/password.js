const mysql = require("mysql");
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");

const db = mysql.createConnection({
  user: process.env.DB_NAME,
  host: "remotemysql.com",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.addPassword = ({ username, password, iv, title, createdBy }, res, next) => {
  db.query(
    "INSERT INTO passwords (username,password,title,createdBy,iv) VALUES (?,?,?,?,?)",
    [username, password, title, createdBy, iv],
    (err) => {
      if (err) {
        return next(err);
      }

      res.send("Password Added");
    }
  );
};

exports.getPasswords = (username, res, next) => {
  db.query(`SELECT id,title FROM passwords WHERE createdBy='${username}'`, (err, results) => {
    if (err) {
      return next(err);
    }

    res.send(results);
  });
};

exports.showPassword = (id, res, next) => {
  db.query(`SELECT title,username,password,iv FROM passwords WHERE id='${id}'`, (err, [data]) => {
    if (err) {
      return next(err);
    }

    if (!data) return next(new ErrorResponse());

    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      Buffer.from(process.env.ENCRYPT_SECRET),
      Buffer.from(data.iv, "hex")
    );

    const decryptedPassword = Buffer.concat([decipher.update(data.password, "hex"), decipher.final()]);

    res.send({ username: data.username, password: decryptedPassword.toString(), title: data.title });
  });
};

exports.editPassword = ({ id, title, username, password, iv }, res, next) => {
  db.query(
    `UPDATE passwords SET title='${title}',username='${username}',password='${password}',iv='${iv}' WHERE id='${id}'`,
    (err, result) => {
      if (err) {
        return next(err);
      }

      if (!result.changedRows) return next(new ErrorResponse("Password not found", 404));

      res.send("Password updated");
    }
  );
};

exports.deletePassword = (id, res, next) => {
  db.query(`DELETE FROM passwords WHERE id='${id}'`, (err, result) => {
    if (err) {
      next(err);
    }

    res.send("Password deleted");
  });
};
