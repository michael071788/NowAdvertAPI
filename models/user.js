require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { Tickets } = require("./tickets");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profile_image: { data: Buffer, contentType: String },
  // tickets: [{ type: Object, ref: "ticket" }],
  earnedTickets: [
    // Tickets,
    {
      // type: Object,
      // ref: "ticket",
      // createdAt: { type: Date, expires: "1m", default: Date.now },
      videoTicket: { type: ObjectId, ref: "advert_list" },
      ticketNumber: { type: String },
      status: { type: String },
      // createdAt: { type: Date, expires: "1m", default: Date.now },
    },
  ],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "1d",
  });

  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().label("Email"),
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phone: Joi.string().required().label("Phone"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
