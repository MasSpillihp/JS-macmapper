const { Sequelize } = require("sequelize");
const Location = require("../models/location");

exports.getAllLogs = async (req, res, next) => {
  // loads the 'Search History' page which will hold a table containing all the searches performed in groups of 10
  Location.findAll()
    .then((locations) => {
      const limit = 10; // sets the limit records per page to 10
      const totalCount = locations.length;
      let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
      let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
      res.render("search-history", {
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
        res.render("search-results", {
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
