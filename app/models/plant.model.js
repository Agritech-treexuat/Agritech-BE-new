const mongoose = require('mongoose');

const plant = new mongoose.Schema({
  name: String
});

const Plant = mongoose.model('Plant', plant);

module.exports = Plant;
