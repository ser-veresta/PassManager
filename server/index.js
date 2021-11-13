const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

const authRoute = require("./routes/auth");
const passwordRoute = require("./routes/password");
const protect = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/password", protect, passwordRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running in port:${PORT}`));
