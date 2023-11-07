const {
  createTeam,
  getAllTeams,
  getSpecificTeamDetail,
  deleteTeam,
  deleteAllTeams,
} = require("../controller/team");

const router = require("express").Router();

router
  .post("/", createTeam)
  .get("/:id", getSpecificTeamDetail)
  .get("/", getAllTeams)
  .delete("/", deleteAllTeams)
  .delete("/:id", deleteTeam);
module.exports = router;
