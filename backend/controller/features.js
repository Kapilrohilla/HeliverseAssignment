const User = require("../model/user");
const getDistinctDomains = async (req, res) => {
  try {
    const distinctDomains = await User.distinct("domain");
    return res.send(distinctDomains);
  } catch (err) {
    return res.send({
      err: "Failed to fetch domains",
      msg: err.message,
    });
  }
};

module.exports = { getDistinctDomains };
