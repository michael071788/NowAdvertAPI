const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const countAdvertSchema = mongoose.Schema({
  advertVideo: { type: ObjectId, ref: "advert_list" },
  likes: [{ type: ObjectId, ref: "user" }],
});

const countAdvertList = mongoose.model("count_advert", countAdvertSchema);

module.exports = { countAdvertList };
