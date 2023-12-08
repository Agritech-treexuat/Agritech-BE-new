const mongoose = require('mongoose');


const serviceRequestSchema = new mongoose.Schema({
  serviceTemplateId: String,
  plantId: [String],
  note: String,
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'waiting'],
    defailt: 'waiting'
  }
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
