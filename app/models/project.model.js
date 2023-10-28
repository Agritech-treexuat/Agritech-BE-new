const mongoose = require('mongoose');


const process = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tx: String,
  type: String,
  value: String,
  time: Date
});

const projectSchema = new mongoose.Schema({
  id: String,
  contractID: String,
  farmID: String,
  input: {
    tx: String,
    initDate: Date,
    seed: String,
    amount: Number,
    images: [String],
    expect: String,
  },
  output: {
    tx: String,
    amount: Number,
    amount_perOne: Number,
    images: [String]
  },
  process: [process],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
