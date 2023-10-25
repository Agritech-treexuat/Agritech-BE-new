const mongoose = require('mongoose');

const plantCultivateSchema = new mongoose.Schema({
  farmId: String,
  plan: [{
    name: String,
    price: Number,
    seed: String,
    phan_bon: [{
      name: String,
      amount_per_kg: Number,
      description: String,
    }],
    thuoc_BVTV: [{
      name: String,
      amount_per_kg: Number,
      description: String,
    }],
  }],
});

const PlantCultivate = mongoose.model('PlantCultivate', plantCultivateSchema);

module.exports = PlantCultivate;
