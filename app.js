const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const googleRouters = require("./routes/google");

app.use(bodyParser.urlencoded({ extendedL: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(homeRoutes);
app.use(googleRouters);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
