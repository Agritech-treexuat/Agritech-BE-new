const mongoose = require('mongoose');

const timeCultivate = new mongoose.Schema({
  start: Number,
  end: Number
})

const plant = new mongoose.Schema({
  name: String,
  image: String,
  info: String,
  timeCultivates: [timeCultivate],
  bestTimeCultivate: {
    start: Number,
    end: Number
  },
  category: {
    type: String,
    enum : ['herb','leafy', 'root'],
    default: 'leafy'
  },
  farmingTime: Number,
  harvestTime: Number
});

const Plant = mongoose.model('Plant', plant);

module.exports = Plant;
