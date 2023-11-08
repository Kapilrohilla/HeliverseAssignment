const { mode } = require("./config");
const info = (...msg) => {
  if (mode !== "test") {
    console.log(...msg);
  }
};

const error = (...err) => {
  console.log(...err);
};

module.exports = {
  info,
  error,
};
