const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: Number,
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  gender: String,
  avatar: {
    type: String,
    default:
      "https://secure.gravatar.com/avatar/66b96ca5edc567d754948e973e34a8fe?s=60&d=mm&r=g",
  },
  domain: String,
  available: {
    type: Boolean,
    default: false,
  },
});
userSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    delete returnedObject.id;
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const User = mongoose.model("user", userSchema);

module.exports = User;
