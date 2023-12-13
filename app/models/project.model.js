const mongoose = require('mongoose');

const agroChemicalItem = new mongoose.Schema({
  name: String,
  amountPerHa: Number,
});

const plan = new mongoose.Schema({
  agroChemicalItems: [agroChemicalItem],
  time: String,
  note: String,
  type: String
})

const npp = new mongoose.Schema({
  name: String,
  amount: Number
})

const historyOutput = new mongoose.Schema({
  tx: String,
  amount: Number,
  amountPerOne: Number,
  images: [String],
  time: Date,
  modifiedAt: Date,
  npp: [npp],
})

const historyProcess = new mongoose.Schema({
  tx: String,
  type: String,
  agroChemicalItems: [agroChemicalItem],
  note: String,
  time: Date,
  modifiedAt: Date
});

const historyExpect = new mongoose.Schema({
  tx: String,
  amount: String,
  note: String,
  time: Date,
  modifiedAt: Date
});

const historyInput = new mongoose.Schema({
  tx: String,
  initDate: Date,
  seed: String,
  amount: Number,
  images: [String],
  expect: String,
  modifiedAt: Date
});


const output = new mongoose.Schema({
  tx: String,
  amount: Number,
  amountPerOne: Number,
  images: [String],
  time: Date,
  isEdited: Boolean,
  historyOutput: [historyOutput],
  npp: [npp],
  exportQR: Boolean
});

const process = new mongoose.Schema({
  tx: String,
  type: String,
  agroChemicalItems: [agroChemicalItem],
  time: Date,
  note: String,
  isEdited: Boolean,
  historyProcess: [historyProcess]
});

const expect = new mongoose.Schema({
  tx: String,
  amount: String,
  note: String,
  time: Date,
  isEdited: Boolean,
  historyExpect: [historyExpect],
});

const projectSchema = new mongoose.Schema({
  id: String,
  farmID: String,
  name: String,
  input: {
    tx: String,
    initDate: Date,
    seed: String,
    amount: Number,
    images: [String],
    expect: String,
    isEdited: Boolean,
    historyInput: [historyInput]
  },
  plan: [plan],
  expect: [expect],
  process: [process],
  output: [output],
  cameraId: [String],
  status: String
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
