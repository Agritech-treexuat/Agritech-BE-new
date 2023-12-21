const mongoose = require('mongoose')

const scanHistory = new mongoose.Schema({
  qrId: String,
  date: String
})

const clientSchema = new mongoose.Schema({
  clientId: String,
  email: String,
  name: String,
  phone: String,
  birth: String,
  address: String,
  map: Object,
  district: String,
  password: String, // Thêm trường password
  history: [scanHistory]
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client
