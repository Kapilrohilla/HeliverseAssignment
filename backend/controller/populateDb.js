const { open } = require("node:fs/promises");
const path = require("path");
const User = require("../model/user");
const Team = require("../model/team");
module.exports = async (req, res, next) => {
  try {
    await User.deleteMany();
    console.log("previous data deleted successfully");
  } catch (err) {
    console.log("failed to users previous data");
    return;
  }
  try {
    await Team.deleteMany({});
  } catch (err) {
    console.log("Failed to clear team collection");
  }
  let filehandle;
  try {
    filehandle = await open(
      path.join(__dirname, "../heliverse_mock_data.json"),
      "r"
    );
    const data = JSON.parse(await filehandle.readFile("utf-8"));
    await User.insertMany(data);

    // console.log(filehandle);
    res.send("Database populated successfully!");
  } catch (err) {
    console.log(err, 1);
  } finally {
    await filehandle?.close();
  }
};
