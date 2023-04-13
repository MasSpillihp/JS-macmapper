const Location = require("../models/location");
const { options } = require("../routes/home");

exports.getAllLogs = (req, res, next) => {
  // loads the 'Search History' page which will hold a table containing all the searches performed in groups of 10
  Location.find()
    .then((locations) => {
      const limit = 10; // sets the limit records per page to 10
      const totalCount = locations.length;
      let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
      let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
      res.render("./home/search-history", {
        pageTitle: "Search History",
        path: "/search-history",
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

exports.searchLogs = async (req, res, next) => {
  // takes search query from search.ejs form and queries database. renders /search-results with results
  const searchQuery = req.body.query;
  //prettier-ignore
  Location.find({ref: {$regex: searchQuery, $options: 'i'}})
  .then(locations => {
        const limit = 10; // sets the limit records per page to 10
        const totalCount = locations.length;
        let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
        let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
        res.render("./home/search-results", {
            pageTitle: "Search Results",
            path: "/search-history",
            locations: locations,
            startIndex: startIndex,
            limit: limit,
            totalCount: totalCount,
            currentPage: currentPage,
        })
    }
    )
};
