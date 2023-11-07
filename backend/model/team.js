const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

teamSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    delete returnedObject.id;
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("teams", teamSchema);
