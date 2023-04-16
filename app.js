const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

require("dotenv").config();

MONGODB_URI =
  "mongodb+srv://" +
  process.env.MONGO_USER +
  ":" +
  process.env.MONGO_PASSWORD +
  "@cluster.e7h7aso.mongodb.net/macmapper";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const mapRoutes = require("./routes/map");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extendedL: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(homeRoutes);
app.use(mapRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
