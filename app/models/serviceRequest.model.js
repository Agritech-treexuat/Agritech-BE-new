const mongoose = require('mongoose');


const serviceRequestSchema = new mongoose.Schema({
  date: Date,
  clientId: String,
  farmId: String,
  serviceTemplateId: String,
  herbListPlantId: [String],
  leafyListPlantId: [String],
  rootListPlantId: [String],
  note: String,
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'waiting'],
    defailt: 'waiting'
  }
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
