const mongoose = require('mongoose')
const ServiceTemplate = require('../models/serviceTemplate.model')
const ServiceRequest = require('../models/serviceRequest.model')
const Farm = require('../models/farm.model')
const Plant = require('../models/plant.model')
const Client = require('../models/client.model')
const Project = require('../models/project.model')
const Garden = require('../models/garden.model')
const PlantFarming = require('../models/plantFarming.model')

exports.initProjectGarden = async (farmId, names) => {
  try {
    const farmID = farmId
    let projectIds = []
    // Tìm farm dựa trên farmID
    const farm = await Farm.find({ _id: new mongoose.Types.ObjectId(farmID) })
    // Kiểm tra xem farm có tồn tại không
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' })
    }

    // Tạo một project với thông tin từ yêu cầu
    for (var name of names) {
      const project = new Project({
        farmID,
        name,
        status: 'waiting'
      })
      // Lưu project vào cơ sở dữ liệu
      const savedProject = await project.save()
      projectIds.push(savedProject._id)
    }

    return projectIds
  } catch (error) {
    console.error(error)
    return []
  }
}

exports.createProjectGarden = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { userId } = req
    const { gardenId } = req.params
    const { name, initDate, seed, amount } = req.body

    const input = {
      initDate,
      seed,
      amount
    }

    // Tìm garden dựa trên gardenId và kiểm tra xem có sở hữu bởi farm có userId không
    const garden = await Garden.findOne({ _id: gardenId, farmId: userId })

    if (!garden) {
      return res.status(404).json({ message: 'Garden not found or not owned by the farm' })
    }

    // Tìm thông tin cây trồng dựa trên tên cây
    const plant = await Plant.findOne({ name })

    // Lấy plantId của cây
    const plantId = plant ? plant._id : null

    // Lấy plantFarming tương ứng với plantId và farmId
    const plantFarming = plantId
      ? await PlantFarming.findOne({ plantId: String(plantId), farmId: garden.farmId, seed: seed })
      : null

    // Tạo một project với thông tin từ yêu cầu
    const project = new Project({
      farmID: userId,
      name,
      input,
      plan: plantFarming.plan
    })

    // Lưu project vào cơ sở dữ liệu
    const savedProject = await project.save()

    // Cập nhật mảng projectId của garden
    garden.projectId.push(savedProject._id)
    await garden.save()

    return res
      .status(201)
      .json({ message: 'Project created successfully', project: savedProject, plantImage: plant?.image })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createGarden = async (farmId, clientId, projectIds, note, templateId, serviceRequestId) => {
  try {
    const farmID = farmId
    // Tìm farm dựa trên farmID
    const farm = await Farm.find({ _id: new mongoose.Types.ObjectId(farmID) })
    // Kiểm tra xem farm có tồn tại không
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' })
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
    })

    // Lưu project vào cơ sở dữ liệu
    const savedGarden = await garden.save()

    return savedGarden
  } catch (error) {
    console.error(error)
    return null
  }
}

exports.getGardensByFarmId = async (req, res) => {
  try {
    const { farmId } = req.params

    // Lấy thông tin của các garden từ farmId
    const gardens = await Garden.find({ farmId })

    // Lấy thông tin của template cho mỗi garden
    const gardensWithTemplate = await Promise.all(
      gardens.map(async (garden) => {
        const template = await ServiceTemplate.findById(garden.templateId)
        return { ...garden.toObject(), template }
      })
    )

    // Lấy thông tin của client cho mỗi garden
    const gardensWithClient = await Promise.all(
      gardensWithTemplate.map(async (garden) => {
        const client = await Client.findOne({ clientId: garden.clientId })
        return { ...garden, client }
      })
    )

    // Lấy thông tin của serviceRequest cho mỗi garden
    const gardensWithServiceRequest = await Promise.all(
      gardensWithClient.map(async (garden) => {
        const serviceRequest = await ServiceRequest.findById(garden.serviceRequestId)
        return { ...garden, serviceRequest }
      })
    )

    res.status(200).json({ gardens: gardensWithServiceRequest })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

exports.updateGardenStatus = async (req, res) => {
  try {
    const { gardenId } = req.params
    const { status } = req.body
    const farmId = req.userId

    // Kiểm tra xem garden có tồn tại và thuộc về farmId không
    const existingGarden = await Garden.findOne({ _id: new mongoose.Types.ObjectId(gardenId), farmId: farmId })

    if (!existingGarden) {
      return res.status(404).json({ message: 'Garden not found or does not belong to the farm' })
    }

    // Cập nhật trạng thái của garden
    existingGarden.status = status
    existingGarden.startDate = new Date()

    // Lưu garden đã cập nhật vào cơ sở dữ liệu
    const updatedGarden = await existingGarden.save()

    res.status(200).json({ message: 'Garden status updated successfully', garden: updatedGarden })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getGardenByGardenId = async (req, res) => {
  try {
    const { farmId, gardenId } = req.params

    // Lấy thông tin của các garden từ farmId
    const gardens = await Garden.find({ _id: new mongoose.Types.ObjectId(gardenId), farmId: farmId })

    // Lấy thông tin của template cho mỗi garden
    const gardensWithTemplate = await Promise.all(
      gardens.map(async (garden) => {
        const template = await ServiceTemplate.findById(garden.templateId)
        return { ...garden.toObject(), template }
      })
    )

    // Lấy thông tin của client cho mỗi garden
    const gardensWithClient = await Promise.all(
      gardensWithTemplate.map(async (garden) => {
        const client = await Client.findOne({ clientId: garden.clientId })
        return { ...garden, client }
      })
    )

    // Lấy thông tin của serviceRequest cho mỗi garden
    const gardensWithServiceRequest = await Promise.all(
      gardensWithClient.map(async (garden) => {
        const serviceRequest = await ServiceRequest.findById(garden.serviceRequestId)
        // Lấy thông tin của các cây herb, leafy, root từ plantId
        const herbList = await Plant.find({ _id: { $in: serviceRequest.herbListPlantId } })
        const leafyList = await Plant.find({ _id: { $in: serviceRequest.leafyListPlantId } })
        const rootList = await Plant.find({ _id: { $in: serviceRequest.herbListPlantId } })
        return { ...garden, serviceRequest, herbList, leafyList, rootList }
      })
    )

    res.status(200).json({ garden: gardensWithServiceRequest[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

exports.getProjectsByGardenId = async (req, res) => {
  try {
    const { gardenId } = req.params

    // Tìm garden dựa trên gardenId
    const garden = await Garden.findOne({ _id: gardenId })

    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' })
    }

    // Lấy danh sách các project từ projectId trong garden
    const projects = await Project.find({ _id: { $in: garden.projectId } })

    // Tạo một mảng kết quả chứa tên, input và ảnh của mỗi project
    const result = []

    for (const project of projects) {
      // Tìm plant dựa trên plantName của project
      const plant = await Plant.findOne({ name: project.name })

      if (!plant) {
        console.warn(`Plant not found for project ${project.name}`)
        continue
      }

      // Thêm thông tin vào kết quả
      result.push({
        projectId: project._id,
        name: project.name,
        input: project.input,
        plantImage: plant.image // Giả sử có trường image trong Plant model
      })
    }

    res.status(200).json({ projects: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.makePlantFarmingAndSeedByGardenId = async (gardenId) => {
  try {
    // Tìm garden dựa trên gardenId
    const garden = await Garden.findById(gardenId)

    if (!garden) {
      throw new Error('Not found garden')
    }

    // Lấy danh sách projectId từ garden
    const projectIds = garden.projectId

    // Lấy thông tin của các project
    const projects = await Project.find({ _id: { $in: projectIds } })
    // Lấy danh sách tên của các project từ projectId
    const plantNames = await Project.find({ _id: { $in: projectIds } }, 'name')

    // Lấy thông tin của các cây (Plant) từ tên của các cây
    const plants = await Plant.find({ name: { $in: plantNames } })

    // Lấy plantId của các cây
    const plantIds = plants.map((plant) => plant._id)

    // Cập nhật kế hoạch cho từng project
    const newProjects = projects.map(async (project) => {
      // Lấy thông tin cây (Plant) tương ứng với tên của project
      const plant = await Plant.findOne({ name: project.name })

      // Lấy plantId của cây
      const plantId = plant ? plant._id : null

      // Lấy plantFarming tương ứng với plantId và farmId
      const plantFarming = plantId
        ? await PlantFarming.findOne({ plantId: String(plantId), farmId: garden.farmId, isDefault: true })
        : null

      // Nếu có plantFarming, cập nhật plan trong project
      if (plantFarming) {
        project.plan = plantFarming.plan
        project.input.seed = plantFarming.seed
        const updatedProject = await project.save()
        return updatedProject
      } else return null
    })
  } catch (error) {
    console.error(error)
  }
}

exports.getPlantFarmingByGardenId = async (req, res) => {
  try {
    const { gardenId } = req.params

    // Tìm garden theo gardenId
    const garden = await Garden.findById(gardenId)

    // Kiểm tra xem garden có tồn tại không
    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' })
    }

    // Lấy danh sách projectId từ garden
    const projectIds = garden.projectId

    // Tìm các project có projectId nằm trong danh sách projectIds
    const projects = await Project.find({ _id: { $in: projectIds } })

    // Chuẩn bị dữ liệu trả về
    const responseData = projects.map((project) => ({
      projectId: project._id,
      input: project.input,
      name: project.name,
      plan: project.plan
    }))

    res.status(200).json({ projects: responseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getProjectsProcessAndTemplateByGardenId = async (req, res) => {
  try {
    const { gardenId } = req.params

    // Tìm garden dựa trên gardenId
    const garden = await Garden.findOne({ _id: gardenId })

    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' })
    }

    // Lấy danh sách các project từ projectId trong garden
    const projects = await Project.find({ _id: { $in: garden.projectId } })

    // Tạo một mảng kết quả chứa tên, input và ảnh của mỗi project
    const result = []

    for (const project of projects) {
      // Tìm plant dựa trên plantName của project
      const plant = await Plant.findOne({ name: project.name })

      if (!plant) {
        console.warn(`Plant not found for project ${project.name}`)
        continue
      }

      // Thêm thông tin vào kết quả
      result.push({
        projectId: project._id,
        name: project.name,
        input: project.input,
        process: project.process,
        plan: project.plan,
        status: project.status,
        plantImage: plant.image // Giả sử có trường image trong Plant model
      })
    }

    res.status(200).json({ projects: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.addClientRequest = async (req, res) => {
  const { gardenId } = req.params
  const clientId = req.userId

  try {
    // Kiểm tra xem garden có tồn tại hay không
    const existingGarden = await Garden.findOne({ _id: gardenId, clientId: clientId })

    if (!existingGarden) {
      return res.status(404).json({ error: 'Garden not found or does not belong to the client.' })
    }

    // Giả sử dữ liệu clientRequest đến từ body request
    const clientRequest = req.body

    // Thêm clientRequest vào danh sách clientRequests trong Garden
    existingGarden.clientRequests.push(clientRequest)

    // Lưu trạng thái mới của Garden
    await existingGarden.save()

    res.status(201).json({
      success: true,
      message: 'ClientRequest added successfully.',
      updatedClientRequest: existingGarden.clientRequests
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getClientRequest = async (req, res) => {
  const { gardenId } = req.params

  try {
    // Kiểm tra xem garden có tồn tại hay không
    const existingGarden = await Garden.findOne({ _id: gardenId })

    if (!existingGarden) {
      return res.status(404).json({ error: 'Garden not found' })
    }

    // Trả về tất cả các clientRequests của Garden
    res.status(200).json({ clientRequests: existingGarden.clientRequests })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.addDelivery = async (req, res) => {
  const farmId = req.userId
  const { gardenId } = req.params
  const { deliveryDetails, note } = req.body // Đảm bảo bạn có thể nhận được dữ liệu từ body

  try {
    // Kiểm tra xem farm có tồn tại hay không
    const existingFarm = await Garden.findOne({ _id: gardenId, farmId: farmId })

    if (!existingFarm) {
      return res.status(404).json({ error: 'Garden not found or you can not access' })
    }

    // Thêm delivery mới vào farm
    const newDelivery = {
      date: new Date(),
      deliveryDetails: deliveryDetails,
      note,
      status: 'coming',
      clientAccept: false,
      clientNote: ''
    }

    existingFarm.deliveries.push(newDelivery)
    await existingFarm.save()

    // Trả về thông tin của delivery mới
    res.status(201).json({ newDelivery })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getDelivery = async (req, res) => {
  const { gardenId } = req.params

  try {
    // Kiểm tra xem farm có tồn tại hay không
    const existingFarm = await Garden.findOne({ _id: gardenId })

    if (!existingFarm) {
      return res.status(404).json({ error: 'Farm not found.' })
    }

    // Trả về tất cả các deliveries của farm
    res.status(200).json({ deliveries: existingFarm.deliveries })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.updateStatusDelivery = async (req, res) => {
  const { userId } = req
  const { deliveryId, gardenId } = req.params
  const { newStatus } = req.body // Đảm bảo bạn có thể nhận được dữ liệu từ body

  try {
    // Kiểm tra xem farm và delivery có tồn tại hay không
    const existingFarm = await Garden.findOne({ _id: gardenId, farmId: userId })
    const existingDelivery = existingFarm.deliveries.id(deliveryId)

    if (!existingFarm || !existingDelivery) {
      return res.status(404).json({ error: 'Farm or delivery not found.' })
    }

    // Cập nhật trạng thái của delivery
    existingDelivery.status = newStatus
    await existingFarm.save()

    // Trả về thông tin của delivery đã được cập nhật
    res.status(200).json({ updatedDelivery: existingDelivery })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
