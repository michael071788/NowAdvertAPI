const mongoose = require("mongoose");

const adverListSchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  imageURI: {
    type: String,
    required: true,
  },
  logoURI: {
    type: String,
    required: true,
  },
  videoURI: {
    type: String,
    required: true,
  },
  ticketValue: {
    type: Number,
    required: true,
  },
  shareTitle: {
    type: String,
    required: true,
  },
  shareMessage: {
    type: String,
    required: true,
  },
  shareUrl: {
    type: String,
    required: true,
  },
});

const AdvertList = mongoose.model("advert_list", adverListSchema);

module.exports = { AdvertList };
