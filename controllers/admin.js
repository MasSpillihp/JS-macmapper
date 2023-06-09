const mongodb = require("mongodb");
const Location = require("../models/location");

const ObjectId = mongodb.ObjectId;

exports.getAdminLogs = async (req, res, next) => {
  // loads the 'Search History' page which will hold a table containing all the searches performed in groups of 10
  Location.find()
    .then((locations) => {
      const limit = 10; // sets the limit records per page to 10
      const totalCount = locations.length;
      let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
      let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
      res.render("./admin/admin", {
        pageTitle: "Admin",
        path: "/admin",
        locations: locations,
        startIndex: startIndex,
        limit: limit,
        totalCount: totalCount,
        currentPage: currentPage,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.searchAdminLogs = async (req, res, next) => {
  // takes search query from search.ejs form and queries database. renders /search-results with results
  const searchQuery = req.body.query;
  //prettier-ignore
  Location.find({ref: {$regex: searchQuery, $options: 'i'}})
  .then(locations => {
        const limit = 10; // sets the limit records per page to 10
        const totalCount = locations.length;
        let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
        let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
        res.render("./admin/admin-search-results", {
            pageTitle: "Search Results",
            path: "/search-history",
            locations: locations,
            startIndex: startIndex,
            limit: limit,
            totalCount: totalCount,
            currentPage: currentPage,
            isAuthenticated: req.session.isLoggedIn,
        })
    }
    )
};

exports.getSpecificLocation = (req, res, next) => {
  // opens the admin-edit page which grabs _id from the URL. Allows admin to make changes to location
  locationId = req.params.id;

  Location.findById(locationId)
    .then((location) => {
      (mac1 = location.mac1),
        (mac2 = location.mac2),
        (ref = location.ref),
        (details = location.details),
        res.render("./admin/admin-edit", {
          pageTitle: "Edit Location",
          path: "/admin/edit",
          mac1: mac1,
          mac2: mac2,
          ref: ref,
          details: details,
          id: locationId,
          isAuthenticated: req.session.isLoggedIn,
        });
    })
    .catch();
};

exports.postEditLocation = async (req, res, next) => {
  // posts the changes to the new Location model and saved in db
  const mac1 = req.body.mac1;
  const mac2 = req.body.mac2;
  const locationId = req.body.id;
  const updatedRef = req.body.ref;
  const updatedDetails = req.body.details;

  if (req.body.hasOwnProperty("edit_button")) {
    const priorLocation = await Location.findById(locationId);
    const lat = priorLocation.latitude;
    const long = priorLocation.longitude;
    const accuracy = priorLocation.accuracy;

    Location.findById(locationId)
      .then((location) => {
        (location.mac1 = mac1),
          (location.mac2 = mac2),
          (location.latitude = lat),
          (location.longitude = long),
          (location.accuracy = accuracy),
          (location.details = updatedDetails),
          (location.ref = updatedRef),
          location.save();
      })
      .then((result) => {
        console.log("Location ID: " + locationId + " successfully updated");
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (req.body.hasOwnProperty("delete_button")) {
    await Location.findByIdAndRemove(locationId);
    console.log("Location ID: " + locationId + " has been deleted");
  }

  res.redirect("/admin");
};
