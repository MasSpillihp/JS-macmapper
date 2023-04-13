const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const locationSchema = new Schema({
  mac1: {
    type: String,
    required: true,
  },
  mac2: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  ref: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Location", locationSchema);
