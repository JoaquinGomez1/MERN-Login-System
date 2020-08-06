const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/login", (req, res) => {
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

module.exports = router;
