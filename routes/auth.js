const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: `Error in ${error.details[0].message}` });

    const user = await User.findOne({ email: req.body.email });
    // console.log(user);

    if (!user) return res.status(400).send({ message: "User Does not Exist" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    const token = user.generateAuthToken();
    // const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY, {
    //   expiresIn: "1d",
    // });

    // let oldTokens = user.tokens || [];

    // if (oldTokens.length) {
    //   oldTokens = oldTokens.filter((t) => {
    //     const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
    //     if (timeDiff < 86400) {
    //       return t;
    //     }
    //   });
    // }

    // await User.findByIdAndUpdate(user._id, {
    //   tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    // });

    res.status(200).send({
      user: user,
      token: token,
      message: "Logged in successfully",
      status: res.statusCode,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
