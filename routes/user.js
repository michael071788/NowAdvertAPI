const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.json({ message: err });
  }
});

router.post("/signup", async (req, res) => {
  try {
    // validate user inputs
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // validate if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ message: "User with given email already Exist!" });

    const phone = await User.findOne({ phone: req.body.phone });
    if (phone)
      return res
        .status(400)
        .send({ message: "User with given phone number already Exist!" });

    // to encrypt password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();

    let data = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    res.status(201).send({
      message: "User created successfully",
      status: res.statusCode,
      data,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
