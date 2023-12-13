const mongoose = require('mongoose');

const deliveryDetail = new mongoose.Schema({
  plant: String,
  amount: Number
})

const clientRequest = new mongoose.Schema({
  date: Date,
  type: {
    type: String,
    enum: ['newPlant', 'deliveryRequest', 'other'],
    default: 'other'
  },
  newPlant: String,
  deliveryDetails: [deliveryDetail],
  note: String
})

const delivery = new mongoose.Schema({
  date: Date,
  deliveryDetails: [deliveryDetail],
  note: String,
  status: {
    type: String,
    enum: ['coming', 'done', 'cancel'],
    default: 'coming'
  },
  clientAccept: Boolean,
  clientNote: String
})


const contractSchema = new mongoose.Schema({
  farmId: String,
  clientId: String,
  projectId: [String],
  note: String,
  templateId: String,
  serviceRequestId: String,
  clientRequests: [clientRequest],
  deliveries: [delivery],
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
