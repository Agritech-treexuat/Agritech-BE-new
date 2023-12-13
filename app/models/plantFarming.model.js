const mongoose = require('mongoose');

const agroChemicalItem = mongoose.Schema({
  name: String,
  amountPerHa: Number,
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
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
  seed: String,
  price: Number,
  plan: [plan],
  timeCultivates: [timeCultivate]
});

const PlantFarming = mongoose.model('PlantFarming', plantFarmingSchema);

module.exports = PlantFarming;
