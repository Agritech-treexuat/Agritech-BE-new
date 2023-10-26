const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.farm = require("./farm.model");
db.contract = require("./contract.model");
db.plantCultivate = require("./plantCultivate.model");
db.project = require("./project.model");
db.qr = require("./project.model");
db.client = require("./client.model");

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["farm", "admin", "client"];

module.exports = db;
