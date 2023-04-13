const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

require("dotenv").config();

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://" +
      process.env.MONGO_USER +
      ":" +
      process.env.MONGO_PASSWORD +
      "@cluster.e7h7aso.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Successfully Connected to MAC Mapper database");
      _db = client.db("macmapper");
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
