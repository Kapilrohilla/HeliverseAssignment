const info = (...msg) => {
  console.log(...msg);
};

const error = (...err) => {
  console.log(...err);
};

module.exports = {
  info,
  error,
};
