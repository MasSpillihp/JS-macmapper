const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const googleRoutes = require("./routes/google");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extendedL: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(homeRoutes);
app.use(googleRoutes);
app.use(errorController.get404);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
