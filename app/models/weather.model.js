const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
  tx: String,
  date: Date,
  district: String,
  description: String,
  temp: String,
  humidity: String,
  speed: String
})

const Weather = mongoose.model('Weather', weatherSchema)

module.exports = Weather
