const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Get Back All The Posts
router.get("/", async (req, res) => {
  // try {
  //   // const posts = await Post.find();
  //   // res.json(posts);

  //   res.send("This is all get all posts");
  // } catch (err) {
  //   // res.json({ message: err });
  //   res.send("This is all get all posts error message");
  // }
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  await new Post({ ...req.body })
    .save()
    .then((post) => {
      res.json("Post added successfully!");
    })
    .catch((error) => {
      res.status(400).send("unable to save to database");
    });
});

module.exports = router;
