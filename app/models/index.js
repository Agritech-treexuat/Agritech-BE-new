const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.agroChemical = require("./agroChemical.model");
db.garden = require("./garden.model");
db.image = require("./image.model");
db.plant = require("./plant.model");
db.project = require("./project.model");
db.role = require("./role.model");
db.serviceRequest = require("./serviceRequest.model");
db.user = require("./user.model");

db.client = require("./client.model");
db.farm = require("./farm.model");
db.qr = require("./qr.model");
db.seed = require("./seed.model");
db.serviceTemplate = require("./serviceTemplate.model");
db.weather = require("./weather.model");

db.ROLES = ["farm", "admin", "client"];

module.exports = db;
