const requests = require("requests");

const googleController = {};

exports.postGoogle = (req, res, next) => {
  const macAddress = req.body.mac;
  console.log(macAddress);
};
