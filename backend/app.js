const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const config = require("./utils/config");
const userRoutes = require("./routes/user");
const middleware = require("./utils/middleware");
app.use(cors());
app.use(express.json());

morgan.token("reqBody", function (req) {
  return JSON.stringify(req.body);
});

const morganString = ":method :url :status :reqBody";
app.use(morgan(morganString));

logger.info("connecting to mongodb");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info(`connected to mongodb: ${config.MONGODB_URI}`))
  .catch((err) => logger.error(`Failed to connect mongodb: ${err}`));

// populating user data
const populate = require("./controller/populateDb");
// routes
app.use("/ping", (req, res) => {
  res.send("pong");
});
app.post("/populate", populate);
app.use("/api/users", userRoutes);
app.use(middleware.errorHandler);
module.exports = app;
