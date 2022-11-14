const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    (err, cli) => {
      if (err) {
        console.log("Error connecting to MongoDB Client: " + err);
      } else {
        console.log("Successfully connected to DB!");
      }
    }
  );
};
