const axios = require("axios");
const fs = require("fs");
const { saveLocation } = require("../models/db");
const { lastSearch } = require("../models/db");
const errorController = require("./error");
require("dotenv").config();

exports.postGoogle = async (req, res, next) => {
  // Get the details from the user form

  const mac1 = req.body.mac1;
  const mac2 = req.body.mac2;
  const ref = req.body.ref;
  const details = req.body.details;
  const apiKey = process.env.GOOGLE_API_KEY;

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

    await saveLocation(mac1, mac2, latitude, longitude, accuracy, details, ref);
    res.redirect("/map");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      //render specific 404 geolocation not found error page 
      res.render('../views/error', {
        pageTitle: 'Error',
        path: '/error',
        errorName: 'Geolocation error: MAC address not found'
      })

    } else {
      // catches all other errors
      console.error(error);
      res.render('../views/error', {
        pageTitle: 'Error',
        path: '/error',
        errorName: 'An error occured with the MAC address API'},)
  }
}
};
