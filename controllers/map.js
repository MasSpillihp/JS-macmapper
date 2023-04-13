const Location = require("../models/location");

exports.getMap = async (req, res, next) => {
  // loads the /map page which defaults to loads the last searched MAC address
  Location.findOne()
    .sort({ _id: -1 })
    .then((lastLocation) => {
      res.render("map", {
        pageTitle: "Map",
        path: "/map",
        ref: lastLocation.ref,
        mac1: lastLocation.mac1,
        mac2: lastLocation.mac2,
        accuracy: lastLocation.accuracy,
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
        zoom: 10,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.mapSpecificSearch = async (req, res, next) => {
  // loads the /map page but instead of last search, it loads the specific search by the user from
  // the /search page - by clicking 'map' on the locations table

  const locationId = req.params.id;
  Location.findById(locationId).then((location) => {
    res.render("specific-map", {
      pageTitle: "View Search",
      path: "/map",
      location: location,
      ref: location.ref,
      mac1: location.mac1,
      mac2: location.mac2,
      accuracy: location.accuracy,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  });
};
