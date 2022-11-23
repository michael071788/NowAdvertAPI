const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  image: { data: Buffer, contentType: String },
});

const ImageModel = mongoose.model("imageModel", ImageSchema);

module.exports = { ImageModel };
