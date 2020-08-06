const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkForErrors = require("../client/src/FormValidation");
const bcrypt = require("bcrypt");

router.post("/register", (req, res) => {
  const { username, password, passwordConfirm, email, gender } = req.body;

  if (!username || !password || !email || !gender) {
    res.status(400).json({ error: "No empty fields" });
  }

  if (password !== passwordConfirm) {
    res.status(400).json({ error: "Password and Verification does not match" });
  }

  mongoose.connect(
    "mongodb://localhost:27017/myForm",
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, db) => {
      if (!err) console.log("Successfull connection to DB");
      else console.log("Error Connecting to DB");

      const noErrorFound = checkForErrors(req.body);

      if (noErrorFound.status) {
        const { email, username, password, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          username,
          password: hashedPassword,
          email,
          gender,
        };

        // Chech for repeated usernames
        const usernameIsRepeated = await db
          .collection("users")
          .findOne({ username });

        if (usernameIsRepeated) {
          return res
            .status(400)
            .json({ error: "Username already taken", field: "username" });
        }
        // Add New User to Database
        else {
          await db.collection("users").insertOne(newUser);

          console.log("Data added to DB");
          return res
            .status(200)
            .json({ message: "user registered succesfully" });
        }

        // Data not properly validated
      } else {
        console.log("There was an error validating your data");
        console.log(`\n${noErrorFound.message}`);
        return res
          .status(400)
          .json({ error: "There was an error validating your data" });
      }
    }
  );
});

module.exports = router;
