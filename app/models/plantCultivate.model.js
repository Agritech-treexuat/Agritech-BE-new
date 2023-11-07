const mongoose = require('mongoose');

const plan = new mongoose.Schema({
  cultivativeId: String,
  amount_per_kg: Number,
  time: String,
  note: String
})

const plantCultivateSchema = new mongoose.Schema({
  farmId: String,
  seedId: String,
  price: Number,
  plan: [plan],
});

const PlantCultivate = mongoose.model('PlantCultivate', plantCultivateSchema);

module.exports = PlantCultivate;
