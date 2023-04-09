const axios = require("axios");
require("dotenv").config();

exports.postGoogle = (req, res, next) => {
  // Get the MAC address from the user form
  const macAddress = req.body.mac;
  const apiKey = process.env.GOOGLE_API_KEY;

  // post request to Google
  axios
    .post("https://www.googleapis.com/geolocation/v1/geolocate?key=" + apiKey, {
      wifiAccessPoints: [
        {
          macAddress: macAddress,
        },
      ],
    })
    .then((response) => {
      //deal with API response here
      console.log(response);
      res.redirect("/map");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
      // debugging api key env not parsing
      console.log("env variable: " + process.env.GOOGLE_API_KEY);
      console.log("apiKey variable: " + apiKey);
    });
};
