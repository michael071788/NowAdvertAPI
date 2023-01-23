const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ticketSchema = mongoose.Schema({
  ticket: { type: ObjectId, ref: "advert_list" },
  ticketNumber: { type: Number },
  status: { type: String },
  createdAt: { type: Date, expires: "1m", default: Date.now },
});

const Tickets = mongoose.model("ticket", ticketSchema);

module.exports = { Tickets };
