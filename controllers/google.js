const axios = require("axios");
const fs = require("fs");
const { saveLocation } = require("../models/db");
require("dotenv").config();

exports.postGoogle = async (req, res, next) => {
  // Get the details from the user form
  // test mac 9c:1c:12:b0:45:f1
  const macAddress = req.body.mac;
  const ref = req.body.ref;
  const details = req.body.details;
  const apiKey = process.env.GOOGLE_API_KEY;

  // post request to Google
  try {
    const response = await axios.post(
      "https://www.googleapis.com/geolocation/v1/geolocate?key=" + apiKey,
      {
        wifiAccessPoints: [
          {
            macAddress: macAddress,
          },
        ],
      }
    );
    const latitude = response["data"]["location"]["lat"];
    const longitude = response["data"]["location"]["lng"];
    const accuracy = response["data"]["accuracy"];

    await saveLocation(macAddress, latitude, longitude, accuracy, details, ref);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
};
