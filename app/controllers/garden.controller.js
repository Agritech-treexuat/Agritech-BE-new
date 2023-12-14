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

exports.getGardensByFarmId = async (req, res) => {
  try {
    const { farmId } = req.params;

    // Lấy thông tin của các garden từ farmId
    const gardens = await Garden.find({ farmId });

    // Lấy thông tin của template cho mỗi garden
    const gardensWithTemplate = await Promise.all(
      gardens.map(async (garden) => {
        const template = await ServiceTemplate.findById(garden.templateId);
        return { ...garden.toObject(), template };
      })
    );

    // Lấy thông tin của client cho mỗi garden
    const gardensWithClient = await Promise.all(
      gardensWithTemplate.map(async (garden) => {
        const client = await Client.findOne({ clientId: garden.clientId });
        return { ...garden, client };
      })
    );

    // Lấy thông tin của serviceRequest cho mỗi garden
    const gardensWithServiceRequest = await Promise.all(
      gardensWithClient.map(async (garden) => {
        const serviceRequest = await ServiceRequest.findById(garden.serviceRequestId);
        return { ...garden, serviceRequest };
      })
    );

    res.status(200).json({ gardens: gardensWithServiceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

exports.updateGardenStatus = async (req, res) => {
  try {
    const { gardenId } = req.params;
    const { status } = req.body;
    const farmId = req.userId;

    // Kiểm tra xem garden có tồn tại và thuộc về farmId không
    const existingGarden = await Garden.findOne({ _id: new mongoose.Types.ObjectId(gardenId), farmId: farmId });

    if (!existingGarden) {
      return res.status(404).json({ message: 'Garden not found or does not belong to the farm' });
    }

    // Cập nhật trạng thái của garden
    existingGarden.status = status;
    existingGarden.startDate = new Date()

    // Lưu garden đã cập nhật vào cơ sở dữ liệu
    const updatedGarden = await existingGarden.save();

    res.status(200).json({ message: 'Garden status updated successfully', garden: updatedGarden });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGardenByGardenId = async (req, res) => {
  try {
    const { farmId, gardenId } = req.params;

    // Lấy thông tin của các garden từ farmId
    const gardens = await Garden.find({ _id: new mongoose.Types.ObjectId(gardenId), farmId: farmId });

    // Lấy thông tin của template cho mỗi garden
    const gardensWithTemplate = await Promise.all(
      gardens.map(async (garden) => {
        const template = await ServiceTemplate.findById(garden.templateId);
        return { ...garden.toObject(), template };
      })
    );

    // Lấy thông tin của client cho mỗi garden
    const gardensWithClient = await Promise.all(
      gardensWithTemplate.map(async (garden) => {
        const client = await Client.findOne({ clientId: garden.clientId });
        return { ...garden, client };
      })
    );

    // Lấy thông tin của serviceRequest cho mỗi garden
    const gardensWithServiceRequest = await Promise.all(
      gardensWithClient.map(async (garden) => {
        const serviceRequest = await ServiceRequest.findById(garden.serviceRequestId);
        // Lấy thông tin của các cây herb, leafy, root từ plantId
        const herbList = await Plant.find({ _id: { $in: serviceRequest.herbListPlantId } });
        const leafyList = await Plant.find({ _id: { $in: serviceRequest.leafyListPlantId } });
        const rootList = await Plant.find({ _id: { $in: serviceRequest.herbListPlantId } });
        return { ...garden, serviceRequest, herbList, leafyList, rootList };
      })
    );


    res.status(200).json({ garden: gardensWithServiceRequest[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
