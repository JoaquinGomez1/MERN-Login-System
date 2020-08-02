const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const checkForErrors = require("./client/src/FormValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;
require("dotenv").config();

// --------------------------- Middlewares ---------------------------
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// --------------------------- Routes ---------------------------

// ---------------- REGISTER ----------------
app.post("/register", (req, res) => {
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

// ---------------- LOGIN ----------------

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ body: req.body, error: "Empty username or password" });
  }

  mongoose.connect(
    "mongodb://localhost:27017/myForm",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, db) => {
      const user = await db.collection("users").findOne({ username });

      // Cannot find the user
      if (!user) {
        return res.status(400).json({ error: "User cannot be found" });
      }

      if (!user.password) {
        return res.status(500).json({ error: "Server error" });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (!doesPasswordMatch) {
        return res
          .status(400)
          .json({ error: "Password and Username does not match" });
      } else if (doesPasswordMatch) {
        // If validation is successful return a jwt to verify the user later
        const token = jwt.sign({ id: user._id }, process.env.SECRET_PASSWORD);

        // Time formatting
        const date = new Date();
        const hour =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();

        const minute =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const seconds =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        const time = hour + ":" + minute + ":" + seconds;

        // Sending response
        return res.status(200).json({
          token,
          id: user._id,
          username: user.username,
          email: user.email,
          message: "Succesfull Login",
          loginTime: time,
        });
      }

      if (err) {
        return res.status(300).json({ error: "server error" });
      }
    }
  );
});

// --------------------------- Listen server ---------------------------
app.listen(port, () => {
  console.log(`Server started on ${port} \nhttp://localhost:3001\n`);
});
