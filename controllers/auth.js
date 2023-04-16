const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

require("dotenv").config();

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  // gets the login page
  let flash = req.flash("error");
  if (flash.length > 0) {
    flashMessage = flash[0];
  } else {
    flashMessage = null;
  }
  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
    flashMessage: flashMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // try to find user by email
  User.findOne({ email: email })
    .then((foundUser) => {
      if (!foundUser) {
        req.flash("error", "Invalid email or password");
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
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
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
  const errors = validationResult(req);

  //email and password vaildation (now includes whether user exists)
  if (!errors.isEmpty()) {
    return res.status(422).render("./auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      isAuthenticated: req.session.isLoggedIn,
      flashMessage: errors.array()[0].msg,
    });
  }
  // if no user exists, create new
  bcrypt
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
      transporter.sendMail({
        to: email,
        from: "sam.phillips@mail.com",
        subject: "Signup Successful!",
        html: "<h1> You have successfully signed up! </h1>",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.flash("info", "Logged out");
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};
