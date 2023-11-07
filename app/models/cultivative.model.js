const mongoose = require('mongoose');

const cultivative = new mongoose.Schema({
  name: String,
  type: String,
  note: String,
  images: [String]
});

const Cultivative = mongoose.model('Cultivative', cultivative);

module.exports = Cultivative;
