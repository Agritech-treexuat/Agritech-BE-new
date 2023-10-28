// Import cần thiết
const Farm = require('../models/farm.model');
const Project = require('../models/project.model');
const {mongoose} = require('mongoose')

// Hành động khởi tạo một project
// Xử lý yêu cầu khởi tạo project từ farm
exports.initProject = async (req, res) => {
  // console.log("Req: ", req)
  // Nếu yêu cầu đã được kiểm tra và có đủ quyền (qua middleware)
  // Bạn có thể tiến hành tạo project
  try {
    // Lấy dữ liệu từ yêu cầu
    const farmID = req.userId;
    const { input, name } = req.body;
    const contractID = req.body.contractID || null;

    // Tìm farm dựa trên farmID
    const farm = await Farm.find({ _id: new mongoose.Types.ObjectId(farmID) });
    // Kiểm tra xem farm có tồn tại không
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Tạo một project với thông tin từ yêu cầu
    const project = new Project({
      farmID,
      name,
      contractID,
      input
    });

    // Lưu project vào cơ sở dữ liệu
    const savedProject = await project.save();

    return res.status(201).json({ message: 'Project created successfully', project: savedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Xu ly yeu cau them projct tu farm
exports.addProcessToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const processData = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.process.push(processData);
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add process to project successfully', updatedProject: updatedProject});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.addOutputToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const outputData = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.output = outputData;
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add output to project successfully', updatedProject: updatedProject});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.getAllProjectsByFarmId = async (req, res) => {
  try {
    const farmId = req.params.farmId; // Lấy farmId từ tham số của tuyến đường

    // Sử dụng mongoose để tìm tất cả các dự án của trang trại dựa trên farmId
    const projects = await Project.find({ farmID: farmId });

    if (!projects) {
      return res.status(404).json({ message: "No projects found for this farm." });
    }

    // Trả về danh sách các dự án
    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Trong controller.js
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường

    // Sử dụng mongoose để tìm dự án dựa trên projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Trả về thông tin từ dự án
    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProcessesByDate = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số
    const searchDate = new Date(req.query.date); // Lấy ngày tìm kiếm từ tham số truy vấn
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1); // Tạo ngày tiếp theo (ngày sau ngày tìm kiếm)

    // Sử dụng Mongoose để tìm kiếm các quy trình trong khoảng thời gian của ngày đã chỉ định
    const project = await Project.findOne({ _id: projectId }); // Lấy thông tin dự án
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const processes = project.process.filter(process => {
      return process.time >= searchDate && process.time < nextDate;
    });

    // Trả về danh sách các quy trình trong ngày đã chỉ định
    res.status(200).json({ processes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
