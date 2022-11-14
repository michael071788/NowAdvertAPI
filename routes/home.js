const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    return res.render("pages/index");
  } catch (err) {
    return res.json({ message: err });
  }
});

module.exports = router;
