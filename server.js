const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const register = require("./routes/register");
const login = require("./routes/login.js");

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

app.use(register);

// ---------------- LOGIN ----------------

app.use(login);
// --------------------------- Listen server ---------------------------
app.listen(port, () => {
  console.log(`Server started on ${port} \nhttp://localhost:3001\n`);
});
