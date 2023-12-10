const mongoose = require('mongoose');
const ServiceTemplate = require('../models/serviceTemplate.model');

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
