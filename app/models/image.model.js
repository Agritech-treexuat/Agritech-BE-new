const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  tx: String,
  date: Date,
  cameraId: String,
  imageUrl: String,
  hash: String
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
