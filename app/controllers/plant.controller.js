const Farm = require('../models/farm.model')
const Project = require('../models/project.model')
const { mongoose } = require('mongoose')
const uuidv4 = require('uuid').v4
const User = require('../models/user.model')
const Role = require('../models/role.model')
const QR = require('../models/qr.model')
const PlantFarming = require('../models/plantFarming.model')
const Plant = require('../models/plant.model')
const Image = require('../models/image.model')
const AgroChemicals = require('../models/agroChemical.model')

const processFile = require('../middlewares/upload')
const { format } = require('util')
const { Storage } = require('@google-cloud/storage')
const Seed = require('../models/seed.model')
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'google-cloud-key.json' })
const bucket = storage.bucket('agritech-data')

// API để thêm cây
exports.addPlant = async (req, res) => {
  try {
    const farmID = req.userId
    const { plantId } = req.body

    if (!plantId) {
      return res.status(400).json({ message: 'Tên cây là bắt buộc' })
    }

    const farm = await Farm.findOne({ farmID })
    if (!farm) {
      return res.status(400).json({ message: 'Khong co farm' })
    }

    // Kiểm tra xem cây với tên đã tồn tại trong cơ sở dữ liệu chưa
    const existingPlant = await farm.plant.includes(plantId)

    if (existingPlant) {
      return res.status(400).json({ message: 'EXISTED_TREE' })
    }

    // Thêm cây vào mảng plant của farm
    farm.plant.push(plantId)

    // Lưu farm đã được cập nhật vào cơ sở dữ liệu
    await farm.save()

    const plants = await Plant.find({ _id: { $in: farm.plant } }, 'id name image')

    res.status(200).json({ message: 'Cây đã được thêm vào farm', plants: plants })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

// API để lấy danh sách cây
exports.getPlantsFarm = async (req, res) => {
  try {
    const { farmId } = req.params
    // Tìm farm dựa trên farmId
    const farm = await Farm.findOne({ farmID: farmId })

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' })
    }

    // Lấy thông tin id, name, image của các plant
    const plants = await Plant.find({ _id: { $in: farm.plant } }, 'id name image')

    res.status(200).json({ plants })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

exports.addPlantCultivate = async (req, res) => {
  try {
    const farmId = req.userId
    const { seed, plantId, price, plan, timeCultivates } = req.body

    if (!seed || !plan) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' })
    }

    // Tạo một PlantFarming mới
    const newPlantCultivate = new PlantFarming({ farmId, seed, price, plan, plantId, timeCultivates })

    // Lưu PlantFarming vào cơ sở dữ liệu
    const savedPlantCultivate = await newPlantCultivate.save()

    res.status(201).json({ message: 'PlantFarming đã được thêm', plantCultivate: savedPlantCultivate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

// API endpoint để cập nhật thông tin của một PlantFarming
exports.updatePlantCultivate = async (req, res) => {
  try {
    const farmId = req.userId
    const { plantCultivateId, price, plan, timeCultivates } = req.body

    if (!plantCultivateId) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' })
    }

    // Kiểm tra xem PlantFarming có tồn tại không
    const existingPlantCultivate = await PlantFarming.findOne({ _id: plantCultivateId, farmId })

    if (!existingPlantCultivate) {
      return res.status(404).json({ message: 'PlantFarming không tồn tại hoặc không thuộc sở hữu của bạn' })
    }

    // Cập nhật thông tin của PlantFarming
    existingPlantCultivate.price = price
    existingPlantCultivate.plan = plan
    existingPlantCultivate.timeCultivates = timeCultivates

    // Lưu PlantFarming đã cập nhật vào cơ sở dữ liệu
    const updatedPlantCultivate = await existingPlantCultivate.save()

    res.status(200).json({ message: 'PlantFarming đã được cập nhật', plantFarming: updatedPlantCultivate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

// API endpoint để lấy thông tin kế hoạch từ plantId
exports.getPlanInFarmFromPlantId = async (req, res) => {
  try {
    const { farmId, plantId } = req.params

    // Tìm tất cả các plantFarming dựa trên farmId và plantId
    const plantFarming = await PlantFarming.find({ farmId, plantId })

    if (!plantFarming || plantFarming.length === 0) {
      return res.status(404).json({ message: 'plantFarming not found' })
    }

    res.status(200).json({ plantFarming })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// API endpoint để lấy thông tin kế hoạch từ seed
exports.getPlanInFarmFromSeed = async (req, res) => {
  try {
    const { seed, farmId } = req.params

    // Tìm thông tin cây trồng dựa trên seed
    const plantFarming = await PlantFarming.find({ seed, farmId })

    if (!plantFarming) {
      return res.status(404).json({ message: 'Plant not found' })
    }

    // Trả về thông tin kế hoạch của cây trồng
    res.status(200).json({ plan: plantFarming.plan })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// API endpoint để lấy thông tin kế hoạch từ seed
exports.getPlanFromPlantId = async (req, res) => {
  try {
    const { plantId } = req.params

    // Tìm thông tin cây trồng dựa trên seed
    const plant = await Plant.findById(plantId)

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' })
    }

    res.status(200).json({ plant: plant })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getPlantWithSeed = async (req, res) => {
  try {
    // Lấy danh sách các plant từ cơ sở dữ liệu
    const plants = await Plant.find()

    // Lấy danh sách các seed từ cơ sở dữ liệu
    const seeds = await Seed.find()

    // Tạo một danh sách kết quả theo định dạng yêu cầu
    const result = plants.map((plant) => {
      const plantData = {
        id: plant._id,
        name: plant.name,
        seeds: seeds
          .filter((seed) => seed.plantId === String(plant._id))
          .map((seed) => ({
            id: seed._id,
            name: seed.name
          }))
      }
      return plantData
    })

    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
