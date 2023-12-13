const mongoose = require('mongoose');

const deliveryDetailSchema = new mongoose.Schema({
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
  amount: Number
});

const clientRequestSchema = new mongoose.Schema({
  date: Date,
  type: {
    type: String,
    enum: ['newPlant', 'deliveryRequest', 'other'],
    default: 'other'
  },
  newPlant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
  deliveryDetails: [deliveryDetailSchema],
  note: String
});

const deliverySchema = new mongoose.Schema({
  date: Date,
  deliveryDetails: [deliveryDetailSchema],
  note: String,
  status: {
    type: String,
    enum: ['coming', 'done', 'cancel'],
    default: 'coming'
  },
  clientAccept: Boolean,
  clientNote: String
});

const contractSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  startDate: Date,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  note: String,
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  clientRequests: [clientRequestSchema],
  deliveries: [deliverySchema],
  status: {
    type: String,
    enum: ['waiting', 'started', 'end'],
    default: 'waiting'
  }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
