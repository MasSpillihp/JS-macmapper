const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // gets the login page
  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // try to find user by email
  User.findOne({ email: email })
    .then((foundUser) => {
      if (!foundUser) {
        console.log("User does not exists");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, foundUser.password)
        .then((doMatch) => {
          if (doMatch) {
            // set session
            req.session.isLoggedIn = true;
            req.session.user = foundUser;
            return req.session.save((result) => {
              res.redirect("/");
              console.log("Password is correct. Logging in");
            });
          }
          res.redirect("/login");
          console.log("password is incorrect");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  // gets the signup page
  res.render("./auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignup = (req, res, next) => {
  // takes data from the form on signup page and submits POST request to DB checking if user
  // exists, and if not, then creates the user
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  //search for users with given email. if exists redirect to '/'
  User.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        // if user exists, redirect to /home
        console.log("Users already exists");
        return res.redirect("/");
      } else {
        // if no user exists, create new
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};
