const mongoose = require('mongoose');

const cultivativeItem = new mongoose.Schema({
  name: String,
  amount_per_ha: Number,
});

const plan = new mongoose.Schema({
  cultivativeItems: [cultivativeItem],
  time: String,
  note: String
})

const npp = new mongoose.Schema({
  name: String,
  amount: Number
})

const historyOutput = new mongoose.Schema({
  tx: String,
  amount: Number,
  amount_perOne: Number,
  images: [String],
  time: Date,
  modified_at: Date,
  npp: [npp],
})

const historyProcess = new mongoose.Schema({
  tx: String,
  type: String,
  name: String,
  amount: Number,
  note: String,
  time: Date,
  modified_at: Date
});

const historyExpect = new mongoose.Schema({
  tx: String,
  amount: String,
  note: String,
  time: Date,
  modified_at: Date
});

const historyInput = new mongoose.Schema({
  tx: String,
  initDate: Date,
  seed: String,
  amount: Number,
  images: [String],
  expect: String,
  modified_at: Date
});


const output = new mongoose.Schema({
  tx: String,
  amount: Number,
  amount_perOne: Number,
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
  cultivativeItems: [cultivativeItem],
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

const image = new mongoose.Schema({
  tx: String,
  hash: String,
  imageUrl: String,
  time: Date
})

const weather = new mongoose.Schema({
  date: Date,
  description: String,
  temp: Number,
  humidity: Number,
  speed: Number
})

const projectSchema = new mongoose.Schema({
  id: String,
  contractID: String,
  farmID: String,
  name: String,
  pId: Number,
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
  output: [output],
  process: [process],
  expect: [expect],
  image: [image],
  weather: [weather],
  plan: [plan]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
