const mongoose = require('mongoose');

const plant = new mongoose.Schema({
  name: String,
  image: String
});

const Plant = mongoose.model('Plant', plant);

module.exports = Plant;
