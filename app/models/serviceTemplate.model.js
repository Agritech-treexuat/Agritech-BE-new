const mongoose = require('mongoose');


const serviceTemplateSchema = new mongoose.Schema({
  farmId: String,
  square: Number,
  expectDeliveryPerWeek: Number,
  expectedOutput: Number,
  expectDeliveryAmount: Number,
  price: Number,
  herbMax: Number,
  leafyMax: Number,
  rootMax: Number
});

const ServiceTemplate = mongoose.model('ServiceTemplate', serviceTemplateSchema);

module.exports = ServiceTemplate;
