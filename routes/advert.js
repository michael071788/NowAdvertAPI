const router = require("express").Router();
const { AdvertList } = require("../models/advert_list");

// get all advert data
router.get("/list", async (req, res) => {
  try {
    const advertLists = await AdvertList.find();
    res.json(advertLists);
    // console.log(advertLists);
  } catch (err) {
    res.json({ message: err });
  }
});

// upload advert data
router.post("/", async (req, res) => {
  try {
    const responseData = await new AdvertList({ ...req.body }).save();

    let data = responseData;

    res.status(201).send({
      message: "Advert created successfully!",
      status: res.statusCode,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// like advert video
router.put("/like/:id", (req, res) => {
  AdvertList.findByIdAndUpdate(
    req.body.videoId,
    {
      $push: { likes: req.params.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      console.log(err);
      return res.status(422).json({ error: err });
    } else {
      res.status(200).send(result);
    }
  });
});

// unlike advert video
router.put("/unlike/:id", (req, res) => {
  AdvertList.findByIdAndUpdate(
    req.body.videoId,
    {
      $pull: { likes: req.params.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// watch advet video
router.put("/watch/:id", (req, res) => {
  AdvertList.findByIdAndUpdate(
    req.body.videoId,
    {
      $push: { watch: req.params.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      console.log("success ", result);
      return res.status(422).json({ error: err });
    } else {
      res.status(200).send(result);
    }
  });
});

// share advet video
router.put("/share/:id", (req, res) => {
  AdvertList.findByIdAndUpdate(
    req.body.videoId,
    {
      $push: { share: req.params.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(200).send(result);
    }
  });
});

module.exports = router;
