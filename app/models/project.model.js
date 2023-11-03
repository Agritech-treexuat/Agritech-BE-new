const mongoose = require('mongoose');

const output = new mongoose.Schema({
  _tx: String,
  amount: Number,
  amount_perOne: Number,
  images: [String],
  time: Date
});

const process = new mongoose.Schema({
  tx: String,
  type: String,
  value: String,
  time: Date
});

const expect = new mongoose.Schema({
  tx: String,
  amount: String,
  note: String,
  time: Date
});

const image = new mongoose.Schema({
  tx: String,
  hash: String,
  imageUrl: String,
  time: Date
})

const projectSchema = new mongoose.Schema({
  id: String,
  contractID: String,
  farmID: String,
  name: String,
  input: {
    tx: String,
    initDate: Date,
    seed: String,
    amount: Number,
    images: [String],
    expect: String,
  },
  output: [output],
  process: [process],
  expect: [expect],
  image: [image]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
