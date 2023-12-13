const mongoose = require('mongoose');
const ServiceTemplate = require('../models/serviceTemplate.model');
const ServiceRequest = require('../models/serviceRequest.model');
const Farm = require('../models/farm.model');
const Plant = require('../models/plant.model');
const Client = require('../models/client.model');
const Project = require('../models/project.model');
const Garden = require('../models/garden.model');

exports.initProjectGarden = async (farmId, names) => {
  try {
    const farmID = farmId
    let projectIds = []
    // Tìm farm dựa trên farmID
    const farm = await Farm.find({ _id: new mongoose.Types.ObjectId(farmID) });
    // Kiểm tra xem farm có tồn tại không
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Tạo một project với thông tin từ yêu cầu
    for(var name of names) {
      const project = new Project({
        farmID,
        name,
        status: 'waiting'
      });
      // Lưu project vào cơ sở dữ liệu
      const savedProject = await project.save();
      projectIds.push(savedProject._id)
    }

    return projectIds
  } catch (error) {
    console.error(error);
    return []
  }
}

exports.createGarden = async (farmId, clientId, projectIds, note, templateId, serviceRequestId) => {
  try {
    const farmID = farmId
    // Tìm farm dựa trên farmID
    const farm = await Farm.find({ _id: new mongoose.Types.ObjectId(farmID) });
    // Kiểm tra xem farm có tồn tại không
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Tạo một project với thông tin từ yêu cầu
    const garden = new Garden({
      farmId,
      clientId,
      projectId: projectIds,
      note,
      templateId,
      serviceRequestId,
      status: 'waiting'
    });

    // Lưu project vào cơ sở dữ liệu
    const savedGarden = await garden.save();

    return savedGarden
  } catch (error) {
    console.error(error);
    return null
  }
}
