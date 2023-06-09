const axios = require("axios");
const { validationResult } = require("express-validator");
const Location = require("../models/location");
require("dotenv").config();

exports.getHomePage = (req, res, next) => {
  // loads the /Home page which contains the user form to search for MAC addresses
  let flash = req.flash("info");
  if (flash.length > 0) {
    flashMessage = flash[0];
  } else {
    flashMessage = null;
  }
  res.render("./home/home", {
    pageTitle: "Home",
    path: "/",
    isAuthenticated: req.session.isLoggedIn,
    flashMessage: flashMessage,
  });
};

exports.postGoogle = async (req, res, next) => {
  // Get the details from the user form and submits a POST API request to google for geolocation data

  const mac1 = req.body.mac1;
  const mac2 = req.body.mac2;
  const ref = req.body.ref;
  const details = req.body.details;
  const apiKey = process.env.GOOGLE_API_KEY;
  const errors = validationResult(req);

  // MAC validation
  if (!errors.isEmpty()) {
    return res.status(422).render("./home/home", {
      pageTitle: "Home",
      path: "/",
      isAuthenticated: req.session.isLoggedIn,
      flashMessage: errors.array()[0].msg,
    });
  }

  // post request to Google
  // prettier-ignore
  try {
    const response = await axios.post(
      "https://www.googleapis.com/geolocation/v1/geolocate?key=" + apiKey,
      {
        considerIp: "false",
        wifiAccessPoints: [
          {
            "macAddress": mac1,
          },
          {
            "macAddress": mac2,
          },
        ],
      }
    );
    const latitude = response["data"]["location"]["lat"];
    const longitude = response["data"]["location"]["lng"];
    const accuracy = response["data"]["accuracy"];

    // using mongoose and Location model
    const location = new Location({mac1: mac1, mac2:mac2, latitude:latitude, longitude:longitude, accuracy:accuracy, details:details, ref:ref});
    location.save()
    .then( result => {
      console.log("Location saved to database")
    })
    .catch (err => {
      console.log("There was an error saving location to database :" + err)
    })
    res.redirect("/map");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      //render specific 404 geolocation not found error page 
      res.render('../views/errors/error', {
        pageTitle: 'Error',
        path: '/error',
        errorName: 'Geolocation error: MAC address not found',
        isAuthenticated: req.session.isLoggedIn,
      })

    } else {
      // catches all other errors
      console.error(error);
      res.render('../views/errors/error', {
        pageTitle: 'Error',
        path: '/error',
        errorName: 'An error occured with the MAC address API',
        isAuthenticated: req.session.isLoggedIn,},)
  }
}
};
