const multer = require("multer");
const uploads = multer({ storage: multer.memoryStorage() });

module.exports = uploads;
