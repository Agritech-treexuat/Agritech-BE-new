const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  id: String,
  type: Number,
  plant: [{
    name: String,
    plan: {
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
    },
  }],
  clientID: String,
  projectID: String,
  note: String,
  tx_hash: String,
  delivery: [{
    tx: String,
    date: String,
    plant: [{
      name: String,
      amount: String,
    }],
  }],
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
