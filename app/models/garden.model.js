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

const gardenSchema = new mongoose.Schema({
  farmId: String,
  startDate: Date,
  clientId: String,
  projectId: [String],
  note: String,
  templateId: String,
  serviceRequestId: String,
  clientRequests: [clientRequestSchema],
  deliveries: [deliverySchema],
  status: {
    type: String,
    enum: ['waiting', 'started', 'end'],
    default: 'waiting'
  },
});

const Garden = mongoose.model('Garden', gardenSchema);

module.exports = Garden;
