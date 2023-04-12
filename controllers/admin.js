const Location = require("../models/location");
const { Sequelize } = require("sequelize");

exports.getAdminLogs = async (req, res, next) => {
  // loads the 'Search History' page which will hold a table containing all the searches performed in groups of 10
  Location.findAll()
    .then((locations) => {
      const limit = 10; // sets the limit records per page to 10
      const totalCount = locations.length;
      let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
      let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
      res.render("admin", {
        pageTitle: "Admin",
        path: "/admin",
        locations: locations,
        startIndex: startIndex,
        limit: limit,
        totalCount: totalCount,
        currentPage: currentPage,
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
  Location.findAll({
        where: {
            ref: {
                [Sequelize.Op.like]: '%'+searchQuery+'%'
            }
        }
    }).then(locations => {
        const limit = 10; // sets the limit records per page to 10
        const totalCount = locations.length;
        let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
        let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
        res.render("admin-search-results", {
            pageTitle: "Search Results",
            path: "/admin/search-history",
            locations: locations,
            startIndex: startIndex,
            limit: limit,
            totalCount: totalCount,
            currentPage: currentPage,
        })
    }
    )
};

exports.getSpecificLocation = (req, res, next) => {
  locationId = req.params.id;

  Location.findByPk(locationId)
    .then((location) => {
      (mac1 = location.mac1),
        (mac2 = location.mac2),
        (ref = location.ref),
        (details = location.details),
        res.render("admin-edit", {
          pageTitle: "Edit Location",
          path: "/admin/edit",
          mac1: mac1,
          mac2: mac2,
          ref: ref,
          details: details,
          id: locationId,
        });
    })
    .catch();
};

exports.postEditLocation = (req, res, next) => {
  const locationId = req.body.id;
  const updatedRef = req.body.ref;
  const updatedDetails = req.body.details;

  if (req.body.hasOwnProperty("edit_button")) {
    Location.findByPk(locationId)
      .then((location) => {
        (location.ref = updatedRef),
          (location.details = updatedDetails),
          location.save();
        console.log("Location updated");
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (req.body.hasOwnProperty("delete_button")) {
    Location.findByPk(locationId).then((location) => {
      location.destroy();
      console.log("Location has been deleted");
    });
  }
  res.redirect("/admin");
};
