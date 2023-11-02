const logger = require("./logger");
function errorHandler(err, req, res, next) {
  if (
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseError"
  ) {
    return res.status(500).json({
      err: "Sorry! somehing wrong with database connection",
      msg: err.message,
    });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({
      err: err.message,
    });
  } else if (err.name === "CastError") {
    return res.status(500).json({
      err: "malfunction id",
    });
  }
  logger.error(err);
  res.sendStatus(500);
}

module.exports = { errorHandler };
