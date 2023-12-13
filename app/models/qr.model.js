const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  privateId: String,
  isScanned: Boolean,
  time: Date,
  timeScanned: Date,
  outputId: String,
  npp: String,
  txScan: String,
  clientId: String
});

const QR = mongoose.model('QR', qrSchema);

module.exports = QR;
