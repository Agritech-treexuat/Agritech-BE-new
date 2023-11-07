const mongoose = require('mongoose');

const seed = new mongoose.Schema({
  plantId: String,
  name: String,
  images: [String]
});

const Seed = mongoose.model('Seed', seed);

module.exports = Seed;
