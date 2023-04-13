const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Location {
  constructor(mac1, mac2, latitude, longitude, accuracy, details, ref, id) {
    (this.mac1 = mac1),
      (this.mac2 = mac2),
      (this.latitude = latitude),
      (this.longitude = longitude),
      (this.accuracy = accuracy),
      (this.details = details),
      (this.ref = ref),
      (this._id = id);
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // if id already exists, then update. If not, create
      dbOp = db
        .collection("locations")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("locations").insertOne(this);
    }

    return dbOp
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("locations")
      .find()
      .toArray()
      .then((locations) => {
        return locations;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(locationId) {
    const db = getDb();
    return db
      .collection("locations")
      .find({ _id: new mongodb.ObjectId(locationId) })
      .next()
      .then((location) => {
        return location;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static deleteById(locationId) {
    const db = getDb();
    return db
      .collection("locations")
      .deleteOne({ _id: new mongodb.ObjectId(locationId) })
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static findLastLocation() {
    const db = getDb();
    return db
      .collection("locations")
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then((location) => {
        return location;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //prettier-ignore
  static queryLocationRef (queryText) {
    const db = getDb()
    const regex = new RegExp(queryText, 'i')
    return db
    .collection('locations')
    .find({ref: {$regex: regex}})
    .toArray()
    .then((locationArray) => {
      return locationArray
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

module.exports = Location;
