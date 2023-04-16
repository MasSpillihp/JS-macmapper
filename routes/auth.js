const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",

  // validation
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid Email")

      // check if email already in use
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((foundUser) => {
          if (foundUser) {
            // if user exists, redirect to /home
            return Promise.reject("Email already in use");
          }
        });
      })
      .normalizeEmail(),

    // password validation
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a password with at least 6 characters")
      .trim(),

    // password + passwordConfirm equality
    body("passwordConfirm")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
