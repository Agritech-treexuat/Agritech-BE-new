const mongoose = require('mongoose');
const ServiceTemplate = require('../models/serviceTemplate.model');
const ServiceRequest = require('../models/serviceRequest.model');
const Farm = require('../models/farm.model');
const Plant = require('../models/plant.model');
const Client = require('../models/client.model');
const { initProjectGarden, createGarden } = require('./garden.controller');

exports.getAllServiceTemplates = async (req, res) => {
  try {
    const farmId = req.params.farmId;
    const serviceTemplates = await ServiceTemplate.find({ farmId: farmId });

    res.status(200).json({ serviceTemplates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addServiceTemplate = async (req, res) => {
  try {
    const farmId = req.userId;
    const { square, expectDeliveryPerWeek, expectedOutput, expectDeliveryAmount, price, herbMax, leafyMax, rootMax } = req.body;

    const newServiceTemplate = new ServiceTemplate({
      farmId,
      square,
      expectDeliveryPerWeek,
      expectedOutput,
      expectDeliveryAmount,
      price,
      herbMax,
      leafyMax,
      rootMax
    });

    const savedServiceTemplate = await newServiceTemplate.save();

    // Lấy tất cả serviceTemplates sau khi thêm mới
    const allServiceTemplates = await ServiceTemplate.find({ farmId: farmId });

    res.status(201).json({ message: 'ServiceTemplate created successfully', serviceTemplate: savedServiceTemplate, allServiceTemplates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateServiceTemplate = async (req, res) => {
  try {
    const farmId = req.userId;
    const serviceTemplateId = req.params.serviceTemplateId;
    const { square, expectDeliveryPerWeek, expectedOutput, expectDeliveryAmount, price, herbMax, leafyMax, rootMax } = req.body;

    const updatedServiceTemplate = await ServiceTemplate.findOneAndUpdate(
      { _id: serviceTemplateId, farmId: farmId },
      {
        $set: {
          square,
          expectDeliveryPerWeek,
          expectedOutput,
          expectDeliveryAmount,
          price,
          herbMax,
          leafyMax,
          rootMax
        },
      },
      { new: true }
    );

    if (!updatedServiceTemplate) {
      return res.status(404).json({ message: 'ServiceTemplate not found or you do not have permission' });
    }

    // Lấy tất cả serviceTemplates sau khi cập nhật
    const allServiceTemplates = await ServiceTemplate.find({ farmId: farmId });

    res.status(200).json({ message: 'ServiceTemplate updated successfully', serviceTemplate: updatedServiceTemplate, allServiceTemplates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    const clientId = req.userId;
    const { farmId, serviceTemplateId, herbListPlantId, leafyListPlantId, rootListPlantId, note } = req.body;

    // Kiểm tra xem farm có tồn tại không
    const isFarmExists = await Farm.exists({ farmID: farmId });
    if (!isFarmExists) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Kiểm tra xem serviceTemplateId có thuộc farm đó không
    const isTemplateInFarm = await ServiceTemplate.exists({ _id: serviceTemplateId, farmId: farmId });
    if (!isTemplateInFarm) {
      return res.status(404).json({ message: 'Service template not found in the farm' });
    }

    // Tiếp tục tạo ServiceRequest nếu mọi thứ hợp lệ
    const newServiceRequest = new ServiceRequest({
      date: new Date(),
      clientId,
      farmId,
      serviceTemplateId,
      herbListPlantId,
      leafyListPlantId,
      rootListPlantId,
      note,
      status: "waiting"
    });

    const savedServiceRequest = await newServiceRequest.save();

    res.status(201).json({ message: 'Service request created successfully', serviceRequest: savedServiceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getFarmServiceRequests = async (req, res) => {
  try {
    const { farmId, status } = req.query;

    const filter = { farmId };

    if (status) {
      filter.status = status;
    }

    const serviceRequests = await ServiceRequest.find(filter);

    const requestsAllInformation = await Promise.all(serviceRequests.map(async (request) => {
      // Lấy thông tin của client
      const client = await Client.find({clientId: request.clientId});

      // Lấy thông tin của service template
      const serviceTemplate = await ServiceTemplate.findById(request.serviceTemplateId);

      // Lấy thông tin của các cây herb, leafy, root từ plantId
      const herbList = await Plant.find({ _id: { $in: request.herbListPlantId } });
      const leafyList = await Plant.find({ _id: { $in: request.leafyListPlantId } });
      const rootList = await Plant.find({ _id: { $in: request.herbListPlantId } });

      return {
        _id: request._id,
        date: request.date,
        clientId: request.clientId,
        name: client.name ? client.name : "chua khai bao ten",
        address: client.address ? client.address : "chua khai bao dia chi",
        phone: client.phone ? client.phone : "chua khai bao sdt",
        square: serviceTemplate.square,
        price: serviceTemplate.price,
        expectDeliveryPerWeek: serviceTemplate.expectDeliveryPerWeek,
        expectedOutput: serviceTemplate.expectedOutput,
        expectDeliveryAmount: serviceTemplate.expectDeliveryAmount,
        herbMax: serviceTemplate.herbMax,
        leafyMax: serviceTemplate.leafyMax,
        rootMax: serviceTemplate.rootMax,
        herbList,
        leafyList,
        rootList,
        note: request.note,
        status: request.status,
      };
    }));

    res.status(200).json({ requestsAllInformation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateServiceRequestStatus = async (req, res) => {
  try {
    const farmId = req.userId
    const { requestId } = req.params;
    const { status } = req.body;

    // Kiểm tra xem ServiceRequest có tồn tại và thuộc về farmId không
    const existingServiceRequest = await ServiceRequest.findOne({ _id: requestId, farmId: farmId });
    const old_status = existingServiceRequest.status

    if (!existingServiceRequest) {
      return res.status(404).json({ message: 'Service request not found or does not belong to the farm' });
    }

    // Tiến hành cập nhật trạng thái
    const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { $set: { status } },
      { new: true }
    );

    if(status === 'accepted' && old_status != 'accepted') {
      getPlantNames(updatedServiceRequest.herbListPlantId, updatedServiceRequest.leafyListPlantId, updatedServiceRequest.rootListPlantId).then(
        names => initProjectGarden(farmId, names).then(
          projectIds => createGarden(farmId, updatedServiceRequest.clientId, projectIds, updatedServiceRequest.note, updatedServiceRequest.serviceTemplateId, updatedServiceRequest._id)
        )
      )
      // const garden = createGarden(farmId, updatedServiceRequest.clientId, projectIds, updatedServiceRequest.note, updatedServiceRequest.serviceTemplateId, updatedServiceRequest._id)
    }

    // Lấy danh sách các serviceRequests có status là 'waiting'
    const waitingServiceRequests = await ServiceRequest.find({ farmId: farmId, status: 'waiting' });

    res.status(200).json({ message: 'Service request status updated successfully', serviceRequest: updatedServiceRequest, waitingServiceRequests: waitingServiceRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

async function getPlantNames(herbListPlantId, leafyListPlantId, rootListPlantId) {
  try {
    // Gộp tất cả các ID vào một mảng duy nhất
    const allPlantIds = [...herbListPlantId, ...leafyListPlantId, ...rootListPlantId];

    // Tìm các cây dựa trên danh sách ID
    const plants = await Plant.find({ _id: { $in: allPlantIds } });

    // Lấy danh sách tên từ kết quả trả về
    const plantNames = plants.map(plant => plant.name);
    console.log("plant: ", plantNames)

    return plantNames;
  } catch (error) {
    console.error(error);
    throw new Error('Lỗi khi lấy danh sách tên cây từ danh sách ID.');
  }
}
