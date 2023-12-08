const mongoose = require('mongoose');

const agroChemicals = new mongoose.Schema({
  name: String,
  type: String,
  note: String,
  images: [String]
});

const AgroChemicals = mongoose.model('AgroChemicals', agroChemicals);

module.exports = AgroChemicals;
