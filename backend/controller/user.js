const User = require("../model/user");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const config = require("../utils/config");

initializeApp(config.firebaseConfig);
const storage = getStorage();

// TODO fix find user by domain, gender, availablity
const getUser = async (req, res, next) => {
  let { page = 1, limit = 10, name, domain, gender, available } = req.query;
  limit = Number(limit);
  page = Number(page);
  gender = Boolean(gender);
  available = Boolean(available);
  const skip = (page - 1) * limit;

  let users; // output
  if (name) {
    try {
      const pipeline = [
        {
          $addFields: {
            nameFilter: {
              $concat: ["$first_name", " ", "$last_name"],
            },
          },
        },
        {
          $match: {
            nameFilter: {
              $regex: `${name}`,
              $options: "i",
            },
          },
        },

        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];
      users = await User.aggregate(pipeline);
      // finding total users
      const totalUserCountPipeline = pipeline.slice(0, 2).concat({
        $count: "totalUser",
      });
      // total user count matching the name query
      let totalUser = await User.aggregate(totalUserCountPipeline);
      if (totalUser.length < 1) {
        return res.status(200).send([users, 0]);
      }
      console.log(totalUser, 99);
      return res.status(200).send([users, totalUser[0].totalUser]);
    } catch (err) {
      next(err);
    }
  } else {
    try {
      users = await User.find().skip(skip).limit(limit);
      totalUser = await User.find().count();
      users = [users, totalUser];
      return res.status(200).send(users);
    } catch (err) {
      next(err);
    }
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
    const delRes = await User.findByIdAndDelete(id);
    if (!delRes) {
      return res.status(400).json({
        err: "user not found",
      });
    }
    res.status(204).send(delRes);
  } catch (err) {
    next(err);
  }
};

// TODO multer needs to be setup for avatar or use external service for storage
const createUser = async (req, res, next) => {
  let { first_name, last_name, email, gender, domain, available } = req.body;
  if (available === "false") {
    available = false;
  } else {
    available = true;
  }

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
  const downloadURL = await getDownloadURL(snapshot.ref);

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send({
      err: "user already exists",
    });
  }

  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      gender,
      avatar: downloadURL,
      domain,
      available,
    });
    if (user) {
      return res.status(201).send({
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.last_name,
        gender: user.gender,
        avatar: downloadURL,
        domain: user.domain,
        available: user.available,
      });
    } else {
      return res.status(500).send({
        err: "Failed to add user in database",
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = { getUser, getSpecificUser, deleteUser, createUser };

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
