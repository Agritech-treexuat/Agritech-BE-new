const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  project_id: String,
  list: [{
    id: String,
    status: String,
    clientID: String,
    date: String,
    tx: String,
  }],
});

const QR = mongoose.model('QR', qrSchema);

module.exports = QR;
