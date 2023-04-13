const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const mapRoutes = require("./routes/map");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extendedL: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(homeRoutes);
app.use(mapRoutes);
app.use(adminRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGO_USER +
      ":" +
      process.env.MONGO_PASSWORD +
      "@cluster.e7h7aso.mongodb.net/macmapper?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
