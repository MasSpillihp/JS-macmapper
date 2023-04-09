const axios = require("axios");
const express = require("express");
const fs = require("fs");
require("dotenv").config();

exports.postGoogle = (req, res, next) => {
  // Get the MAC address from the user form
  // test mac 9c:1c:12:b0:45:f1
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
      const dataPath = "./data/response.json";
      const responseData = JSON.stringify(response["data"]);

      fs.appendFile(dataPath, responseData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Response added to file");
        }
      });
    });

  res.redirect("/");
};
