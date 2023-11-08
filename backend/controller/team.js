const Team = require("../model/team");
const User = require("../model/user");
const mongoose = require("mongoose");

async function createTeam(req, res, next) {
  const { title, members } = req.body;

  const memberObjectId = members.map((ele) => {
    return new mongoose.Types.ObjectId(ele);
  });
  const users = await User.find({
    _id: { $in: memberObjectId },
  });
  // checking wheather all domain are distinct or not
  const uniqueDomainsSet = new Set(users.map((obj) => obj.domain));
  if (uniqueDomainsSet.size !== users.length) {
    return res.status(400).send({
      err: "Error: users domain should be unique",
    });
  }

  if (!title) {
    return res.status(400).send({
      err: "title is required",
    });
  }
  if (members.constructor !== Array) {
    return res.send({
      err: "members should be an array",
    });
  }

  try {
    const team = await Team.create({
      title,
      members,
    });
    if (team) {
      const recentlyCreatedTeam = await Team.findById(team.id).populate(
        "members"
      );
      return res.status(201).send(recentlyCreatedTeam);
    } else {
      return res.status(400).send({
        err: "Error: Failed to create team",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function getSpecificTeamDetail(req, res, next) {
  const id = req.params.id;

  try {
    const team = await Team.findById(id).populate("members");
    if (team) {
      return res.status(200).send(team);
    } else {
      return res.status(400).send({
        err: "Error: no such team exists",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function getAllTeams(_req, res, next) {
  try {
    const teams = await Team.find({}).populate("members");
    if (teams.length !== 0) {
      return res.send(teams);
    } else {
      return res.status(400).send({
        err: "No team exists",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteTeam(req, res, next) {
  const id = req.params.id;

  try {
    const r = await Team.findByIdAndDelete(id);
    if (r) {
      return res.status(200).send(r);
    } else {
      return res.status(400).send({ err: "Error: no such team exists" });
    }
  } catch (err) {
    next(err);
  }
}
async function deleteAllTeams(req, res, next) {
  try {
    const r = await Team.deleteMany({});
    return res.status(204).send(r);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  createTeam,
  getSpecificTeamDetail,
  getAllTeams,
  deleteTeam,
  deleteAllTeams,
};
