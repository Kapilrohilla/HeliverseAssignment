/* /api/users */

const {
  getUser,
  getSpecificUser,
  deleteUser,
  createUser,
  updateUser,
} = require("../controller/user");
const uploads = require("../utils/multerCon");
// GET /api/users: Retrieve all users with pagination support.
// GET /api/users/:id: Retrieve a specific user by ID.
// POST /api/users: Create a new user.
// PUT /api/users/:id: Update an existing user.
// DELETE /api/users/:id: Delete a user.

const router = require("express").Router();

router
  .get("/", getUser)
  .get("/:id", getSpecificUser)
  .post("/", uploads.single("avatar"), createUser)
  .delete("/:id", deleteUser);
// .put("/:id", uploads.single("avatar"), updateUser);

module.exports = router;
