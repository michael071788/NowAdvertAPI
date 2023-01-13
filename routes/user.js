const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const otp = Math.floor(1000 + Math.random() * 9000); // generate a 4-digit OTP

const sendEmail = (user) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.myEmail,
        pass: process.env.myPassword,
      },
      tls: { rejectUnauthorized: false },
    });
    const mail_config = {
      from: process.env.myEmail,
      // to: "mackdaniel06@gmail.com",
      to: user,
      subject: "Testing Email",
      text: `Your test otp is ${otp}`,
    };
    transporter.sendMail(mail_config, function (error, info) {
      if (error) {
        console.log("email error", error);
        return reject({ message: "An error occured" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
};

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.json({ message: err });
  }
});

// find specific user
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userData = await User.findById(id);
<<<<<<< HEAD
    // console.log("userdata", userData);
    res.json(userData);
=======
    res.send(userData);
>>>>>>> 8577eef14e613b5a9158762bcd4324453c153add
  } catch (err) {
    res.json({ message: err });
  }
});

// update user info
router.patch("/update/:id", async (req, res) => {
  try {
    const userId = await User.findById(req.params.id);
    Object.assign(userId, req.body);
    userId.save();
    res.send({ data: userId });
  } catch {
    res.status(404).send({ error: "User is not found!" });
  }
});

// update user password
router.patch("/update-password/:id", async (req, res) => {
  try {
    const userData = await User.findById(req.params.id);

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      userData.password
    );

    if (!isMatch) {
      // Hash the new password
      return res.status(401).send({ message: "Invalid Password" });
    }

    if (!userData) return res.status(401).send({ message: "User not found" });

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(401).send({ message: "Password not match" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);

    await User.findByIdAndUpdate(userData.id, {
      $set: {
        password: hashPassword,
      },
    });

    // userData.save();

    res.status(201).send({
      message: "successfully",
      status: res.statusCode,
      // userData,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});

// register user
router.post("/signup", async (req, res) => {
  try {
    // validate user inputs
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // validate if the email already exists
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ message: "User with given email already Exist!" });

    // validate if the phone exists
    const phone = await User.findOne({ phone: req.body.phone });
    if (phone)
      return res
        .status(400)
        .send({ message: "User with given phone number already Exist!" });

    // const otp = Math.floor(1000 + Math.random() * 9000); // generate a 4-digit OTP

    // to encrypt password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // sendEmail();
    // .then((response) => res.send(response.message))
    // .catch((error) => res.status(500).send(error.message));

    await new User({ ...req.body, OTP: otp, password: hashPassword }).save();

    let data = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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

// get all user tickets
router.post("/tickets/:id", async (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        earnedTickets: {
          ...req.body,
        },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(200).send({
        message: "success",
        result,
      });
    }
  });
});

// get user profile image
router.get("/profile-image/:id", async (req, res) => {
  const profileImage = await User.findById(req.params.id);
  res.send(profileImage.profile_image);
});

<<<<<<< HEAD
router.post("/verify-otp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send("User not found.");
  }

  if (user.OTP === req.body.otp) {
    user.isVerified = true;

    const token = user.generateAuthToken();

    await user.save();

    return res.status(200).send({
      message: "Email verified successfully.",
      token: token,
      status: res.statusCode,
      user: user,
    });
  } else {
    return res.status(401).send({ message: "Invalid OTP." });
  }
});

router.post("/generate-otp", (req, res) => {
  const user = req.body.email;
  console.log("user", user);

  sendEmail(user)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});
=======
// upload user profile image

>>>>>>> 8577eef14e613b5a9158762bcd4324453c153add
module.exports = router;
