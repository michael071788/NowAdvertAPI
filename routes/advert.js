const router = require("express").Router();
const { AdvertList } = require("../models/advert_list");

router.get("/list", async (req, res) => {
  try {
    const advertLists = await AdvertList.find();
    res.json(advertLists);
    // console.log(advertLists);
  } catch (err) {
    res.json({ message: err });
  }
});

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

module.exports = router;
