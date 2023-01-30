const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: { contentType: String },
  image: { data: Buffer, contentType: String },
});

const ImageModel = mongoose.model("imageModel", ImageSchema);

module.exports = { ImageModel };
