const mongoose = require('mongoose')

const agroChemicalItem = mongoose.Schema({
  name: String,
  amountPerHa: Number
})

const timeCultivate = new mongoose.Schema({
  start: Number,
  end: Number
})

const plan = new mongoose.Schema({
  agroChemicalItems: [agroChemicalItem],
  time: String,
  note: String,
  type: String
})

const plantFarmingSchema = new mongoose.Schema({
  farmId: String,
  plantId: String,
  seed: String,
  price: Number,
  plan: [plan],
  timeCultivates: [timeCultivate],
  isDefault: Boolean
})

const PlantFarming = mongoose.model('PlantFarming', plantFarmingSchema)

module.exports = PlantFarming
