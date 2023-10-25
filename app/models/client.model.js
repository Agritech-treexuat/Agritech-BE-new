const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  id: String,
  profile: {
    name: String,
    phone: String,
    email: String,
    birth: String,
    address: String,
  },
  password: String, // Thêm trường password
  history: [{
    qr_id: String,
    date: String,
  }],
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
