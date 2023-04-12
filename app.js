const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const locations = require("./models/location");

const app = express();
app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const googleRoutes = require("./routes/google");
const mapRoutes = require("./routes/map");
const adminRoutes = require("./routes/admin");
// const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Location = require("./models/location");

app.use(bodyParser.urlencoded({ extendedL: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(homeRoutes);
app.use(googleRoutes);
app.use(mapRoutes);
app.use(adminRoutes);
// app.use(errorController.get404);

Location.sync()
  .then((result) => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.listen(3000);
