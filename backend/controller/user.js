const User = require("../model/user");
const logger = require("../utils/logger");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} = require("firebase/storage");
const config = require("../utils/config");

initializeApp(config.firebaseConfig);
const storage = getStorage();

const getUser = async (req, res, next) => {
  let { page = 1, limit = 10, name, domain, gender, available } = req.query;
  limit = Number(limit);
  page = Number(page);
  const skip = (page - 1) * limit;

  if (available === "false") {
    available = false;
  } else if (available === "true") {
    available = true;
  }
  if (!domain) {
    domain = "";
  }
  if (!gender) {
    gender = "";
  }

  const pipeline = [
    {
      $addFields: {
        full_name: {
          $concat: ["$first_name", " ", "$last_name"],
        },
      },
    },
    {
      $match: {},
    },
    {
      $unset: "full_name",
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  if (name) {
    pipeline[1].$match.full_name = { $regex: `${name}`, $options: "i" };
  }
  if (domain) {
    pipeline[1].$match.domain = { $regex: `${domain}`, $options: "i" };
  }
  if (gender) {
    pipeline[1].$match.gender = { $regex: `${gender}` };
  }
  if (available !== "" && available !== undefined) {
    pipeline[1].$match.available = available;
  }
  try {
    let users = await User.aggregate(pipeline);
    // performing toJSON operation on users
    users = users.map((user) => {
      return User.hydrate(user);
    });
    // finding total users
    const totalUserCountPipeline = pipeline.slice(0, 3).concat({
      $count: "totalUser",
    });
    // total user count matching the name query
    let totalUser = await User.aggregate(totalUserCountPipeline);
    if (totalUser[0]) {
      return res.status(200).send([users, totalUser[0].totalUser]);
    } else {
      return res.status(404).send({
        err: "user not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getSpecificUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ err: "user not found" });
    }
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user !== null) {
      const userProfilePic = user.avatar;
      if (userProfilePic.includes("firebasestorage")) {
        const imageRef = ref(storage, userProfilePic);
        await deleteObject(imageRef);
      }
      const delRes = await User.findByIdAndDelete(id);
      if (!delRes) {
        return res.status(400).json({
          err: "user not found",
        });
      }
      res.sendStatus(200);
    } else {
      res.status(404).send({
        err: "user not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  let {
    first_name,
    last_name,
    email,
    gender,
    domain = "None",
    available,
  } = req.body;
  available = Boolean(available);

  const dateTime = giveCurrentDateTime();

  if (!(email && first_name && last_name)) {
    return res.status(400).send({
      err: "email, first_name, last_name is required",
    });
  }
  if (!(gender === "Male" || gender === "Female")) {
    return res.status(400).send({
      err: 'gender should be either "Male" or "Female',
    });
  }
  if (typeof available !== "boolean") {
    return res.status(400).send({
      err: '"available" should be a boolean value',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).send({
      err: "email should be in correct format",
    });
  }
  let downloadURL;
  if (req.file) {
    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );
    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    downloadURL = await getDownloadURL(snapshot.ref);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send({
      err: "user already exists",
    });
  }
  let newUser;
  if (downloadURL) {
    newUser = {
      first_name,
      last_name,
      email,
      gender,
      available,
      domain,
      avatar: downloadURL,
    };
  } else {
    newUser = { first_name, last_name, email, gender, available, domain };
  }
  try {
    // let user = await User.create(newUser);
    let user = new User(newUser);
    await user.save();
    user = User.hydrate(user);
    if (user) {
      return res.status(201).send(user);
    } else {
      return res.status(500).send({
        err: "Failed to add user in database",
      });
    }
  } catch (err) {
    next(err);
  }
};

// incomplete
/*
const updateUser = async (req, res) => {
  let {
    first_name,
    last_name,
    email,
    gender,
    domain = "None",
    available = false,
  } = req.body;

  const id = req.params.id;

  if (!(first_name || last_name || email || gender)) {
    return res.status(400).send({
      err: "first_name, last_name, email, gender is required",
    });
  }

  available = Boolean(available);

  if (typeof available !== "boolean") {
    return res.status(400).send({
      err: "available should be a boolean value",
    });
  }

  let avatar;
  let oldUserId;
  try {
    oldUserId = await User.findById(id);
    console.log(oldUserId, 0);
    if (avatar !== oldUserId.avatar) {
      const dateTime = giveCurrentDateTime();
      const oldAvatar = oldUserId.avatar;
      if (oldAvatar.includes("firebasestorage")) {
        const imageRef = ref(storage, oldAvatar);
        try {
          await deleteObject(imageRef);
        } catch (err) {
          return res.status(400).send({
            err: `Error: update failed ${err.message}`,
          });
        }
      }

      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "--time--" + dateTime}`
      );
      const metaData = {
        contentType: req.file.mimetype,
      };
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metaData
      );

      avatar = await getDownloadURL(snapshot.ref);
    }
  } catch (err) {
    return res.status(400).send({ err: `Failed to update: ${err.message}` });
  }
  // need update
  try {
    const user = await User.findByIdAndUpdate({
      first_name,
      last_name,
      email,
      gender,
      avatar,
      domain,
      available,
    });
    if (user) {
      return res.status(200).send(user);
      // return res.status(201).send({
      //   id: user._id,
      //   first_name: user.first_name,
      //   last_name: user.last_name,
      //   email: user.last_name,
      //   gender: user.gender,
      //   avatar: downloadURL,
      //   domain: user.domain,
      //   available: user.available,
      // });
    } else {
      return res.status(500).send({
        err: "Failed to add update user database",
      });
    }
  } catch (err) {
    return res.status(500).send({
      err: "Something went wrong!",
      message: err.message,
    });
  }
};
*/
module.exports = {
  getUser,
  getSpecificUser,
  deleteUser,
  createUser,
  // updateUser,
};

/* helper function */
function isEmail(email) {
  const regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+.com$", "i");
  return regex.test(email);
}
const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
