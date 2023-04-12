const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Location = sequelize.define("location", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  mac1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mac2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  latitude: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  longitude: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  accuracy: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  ref: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  details: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Location;
