const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  id: String,
  farmID: String,
  email: String,
  name: String,
  description: String,
  map: Object,
  vietgap: Object,
  images: [String],
  square: Number,
  password: String, // Thêm trường password
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;
