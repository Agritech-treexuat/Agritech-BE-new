const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: String,
  contractID: String,
  farm: String,
  input: {
    tx: String,
    seed: String,
    amount: Number,
    images: [String]
  },
  output: {
    tx: String,
    amount: Number,
    amount_perOne: Number,
    images: [String]
  },
  process: [{
    tx: String,
    type: String,
    value: String,
  }],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
