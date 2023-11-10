// Import cần thiết
const Farm = require('../models/farm.model');
const Project = require('../models/project.model');
const {mongoose} = require('mongoose')

const User = require('../models/user.model');
const Role = require('../models/role.model');
const QR = require('../models/qr.model');
const PlantCultivate = require('../models/plantCultivate.model')
const Plant = require('../models/plant.model')

// Middleware xác thực JWT
const authJwt = require('../middlewares/authJwt');

// API để lấy thông tin cá nhân của người dùng hiện tại
exports.getMyProfile = async (req, res) => {
  try {
    // Lấy thông tin người dùng hiện tại từ JWT token đã xác thực
    const userId = req.userId;

    // Sử dụng Mongoose để tìm người dùng dựa trên userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Lấy danh sách các vai trò của người dùng
    const roles = await Role.find({ _id: { $in: user.roles } });

    // Loại bỏ mật khẩu khỏi thông tin người dùng
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      roles: roles.map(role => role.name),
    };

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    return res.status(200).json({ message: 'Add process to project successfully', updatedProjectProcess: updatedProject.process});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.addImageToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const imageData = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.image.push(imageData);
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add image to project successfully', updatedProject: updatedProject});
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
    project.output.push(outputData);
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add output to project successfully', updatedProjectOutput: updatedProject.output});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.addExpectToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const expectData = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.expect.push(expectData);
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add expect to project successfully', updatedProjectExpect: updatedProject.expect});
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

exports.getProcesses = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số
    const searchDate = req.query.date ? new Date(req.query.date) : null; // Lấy ngày tìm kiếm từ tham số truy vấn hoặc để null nếu không có tham số
    const nextDate = searchDate ? new Date(searchDate) : null;

    if (searchDate) {
      nextDate.setDate(searchDate.getDate() + 1); // Tạo ngày tiếp theo (ngày sau ngày tìm kiếm)
    }

    // Sử dụng Mongoose để tìm kiếm các quy trình trong khoảng thời gian của ngày đã chỉ định
    const project = await Project.findOne({ _id: projectId }); // Lấy thông tin dự án
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    let processes = project.process;

    if (searchDate) {
      processes = project.process.filter(process => {
        return process.time >= searchDate && process.time < nextDate;
      });
    }

    // Trả về danh sách các quy trình trong ngày đã chỉ định hoặc toàn bộ danh sách nếu không có ngày tìm kiếm
    res.status(200).json({ processes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getImages = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số
    const searchDate = req.query.date ? new Date(req.query.date) : null; // Lấy ngày tìm kiếm từ tham số truy vấn hoặc để null nếu không có tham số
    const nextDate = searchDate ? new Date(searchDate) : null;

    if (searchDate) {
      nextDate.setDate(searchDate.getDate() + 1); // Tạo ngày tiếp theo (ngày sau ngày tìm kiếm)
    }

    // Sử dụng Mongoose để tìm kiếm các quy trình trong khoảng thời gian của ngày đã chỉ định
    const project = await Project.findOne({ _id: projectId }); // Lấy thông tin dự án
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    let images = project.image;

    if (searchDate) {
      images = project.image.filter(image => {
        return image.time >= searchDate && image.time < nextDate;
      });
    }

    // Trả về danh sách các quy trình trong ngày đã chỉ định hoặc toàn bộ danh sách nếu không có ngày tìm kiếm
    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOutputs = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số
    const searchDate = req.query.date ? new Date(req.query.date) : null; // Lấy ngày tìm kiếm từ tham số truy vấn hoặc để null nếu không có tham số
    const nextDate = searchDate ? new Date(searchDate) : null;

    if (searchDate) {
      nextDate.setDate(searchDate.getDate() + 1); // Tạo ngày tiếp theo (ngày sau ngày tìm kiếm)
    }

    // Sử dụng Mongoose để tìm kiếm các quy trình trong khoảng thời gian của ngày đã chỉ định
    const project = await Project.findOne({ _id: projectId }); // Lấy thông tin dự án
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    let outputs = project.output;

    if (searchDate) {
      outputs = project.output.filter(output => {
        return output.time >= searchDate && output.time < nextDate;
      });
    }

    // Trả về danh sách các quy trình trong ngày đã chỉ định hoặc toàn bộ danh sách nếu không có ngày tìm kiếm
    res.status(200).json({ outputs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExpects = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Lấy projectId từ tham số
    const searchDate = req.query.date ? new Date(req.query.date) : null; // Lấy ngày tìm kiếm từ tham số truy vấn hoặc để null nếu không có tham số
    const nextDate = searchDate ? new Date(searchDate) : null;

    if (searchDate) {
      nextDate.setDate(searchDate.getDate() + 1); // Tạo ngày tiếp theo (ngày sau ngày tìm kiếm)
    }

    // Sử dụng Mongoose để tìm kiếm các quy trình trong khoảng thời gian của ngày đã chỉ định
    const project = await Project.findOne({ _id: projectId }); // Lấy thông tin dự án
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    let expects = project.expect;

    if (searchDate) {
      expects = project.expect.filter(output => {
        return output.time >= searchDate && output.time < nextDate;
      });
    }

    // Trả về danh sách các quy trình trong ngày đã chỉ định hoặc toàn bộ danh sách nếu không có ngày tìm kiếm
    res.status(200).json({ expects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInput = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Get project id from the route parameter

    // Use Mongoose to find the project by id
    const project = await Project.findOne({ _id: projectId });

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Get the input information from the project
    const input = project.input;

    // Return the input data
    res.status(200).json({ input });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProjectsByFarmId = async (req, res) => {
  try {
    const farmId = req.params.farmId; // Lấy farmId từ tham số đường dẫn

    // Sử dụng Mongoose để tìm tất cả các dự án của trang trại dựa trên farmId
    const projects = await Project.find({ farmID: farmId });

    // Chuyển đổi dữ liệu thành định dạng bạn cần
    const projectInfo = projects.map(project => {
      return {
        id: project._id,
        name: project.name,
        seed: project.input.seed,
        initDate: project.input.initDate,
        image: project.input.images[0], // Lấy hình ảnh đầu tiên trong mảng images
      };
    });

    res.status(200).json(projectInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProcess = async (req, res) => {
  try {
    const farmID = req.userId;
    const projectId = req.params.projectId;
    const processId = req.params.processId;
    const newProcessData = req.body;

    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const process = project.process.id(processId);
    if (!process) {
      return res.status(404).json({ message: "Process not found." });
    }

    // Tạo một bản sao của quy trình trước khi chỉnh sửa
    const previousProcessData = { ...process.toObject() };
    delete previousProcessData._id; // Xóa trường _id

    // Cập nhật quy trình với dữ liệu mới
    for (const key in newProcessData) {
      if (newProcessData.hasOwnProperty(key) && key !== 'historyProcess' && key != 'isEdited') {
        process[key] = newProcessData[key];
      }
    }

    // Xóa các trường không còn tồn tại trong dữ liệu mới
    for (const key in previousProcessData) {
      if (!newProcessData.hasOwnProperty(key) && key !== 'historyProcess' && key !== '_id' && key != 'isEdited') {
        delete process[key];
      }
    }

    // Đánh dấu quy trình đã được chỉnh sửa
    process.isEdited = true;

    // Lưu lịch sử chỉnh sửa
    process.historyProcess.push({
      ...previousProcessData,
      modified_at: new Date(),
    });

    // Lưu lại dự án với thông tin cập nhật
    await project.save();

    res.status(200).json({ message: "Process updated successfully", updatedProcess: project.process });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editOutput = async (req, res) => {
  try {
    const farmID = req.userId;
    const projectId = req.params.projectId;
    const outputId = req.params.outputId;
    const newOutputData = req.body;

    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const output = project.output.id(outputId);
    if (!output) {
      return res.status(404).json({ message: "Output not found." });
    }

    // Tạo một bản sao của quy trình trước khi chỉnh sửa
    const previousOutputData = { ...output.toObject() };
    delete previousOutputData._id; // Xóa trường _id

    // Cập nhật quy trình với dữ liệu mới
    for (const key in newOutputData) {
      if (newOutputData.hasOwnProperty(key) && key != 'historyOutput' && key != 'isEdited') {
        output[key] = newOutputData[key];
      }
    }

    // Đánh dấu quy trình đã được chỉnh sửa
    output.isEdited = true;

    // Lưu lịch sử chỉnh sửa
    output.historyOutput.push({
      ...previousOutputData,
      modified_at: new Date(),
    });

    // Lưu lại dự án với thông tin cập nhật
    await project.save();

    res.status(200).json({ message: "Output updated successfully", updatedOutput: project.output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editExpect = async (req, res) => {
  try {
    const farmID = req.userId;
    const projectId = req.params.projectId;
    const expectId = req.params.expectId;
    const newExpectData = req.body;

    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const expect = project.expect.id(expectId);
    if (!expect) {
      return res.status(404).json({ message: "Process not found." });
    }

    // Tạo một bản sao của quy trình trước khi chỉnh sửa
    const previousExpectData = { ...expect.toObject() };
    delete previousExpectData._id; // Xóa trường _id

    // Cập nhật quy trình với dữ liệu mới
    for (const key in newExpectData) {
      if (newExpectData.hasOwnProperty(key) && key != 'historyExpect' && key != 'isEdited') {
        expect[key] = newExpectData[key];
      }
    }

    // Đánh dấu quy trình đã được chỉnh sửa
    expect.isEdited = true;

    // Lưu lịch sử chỉnh sửa
    expect.historyExpect.push({
      ...previousExpectData,
      modified_at: new Date(),
    });

    // Lưu lại dự án với thông tin cập nhật
    await project.save();

    res.status(200).json({ message: "Expect updated successfully", updatedExpect: project.expect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editInput = async (req, res) => {
  try {
    const farmID = req.userId;
    const projectId = req.params.projectId;
    const newInputData = req.body;

    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const input = project.input

    // Tạo một bản sao của quy trình trước khi chỉnh sửa
    const previousInputData = { ...input };

    // Cập nhật quy trình với dữ liệu mới
    for (const key in newInputData) {
      if (newInputData.hasOwnProperty(key) && key != 'historyInput' && key != 'isEdited') {
        input[key] = newInputData[key];
      }
    }

    // Đánh dấu quy trình đã được chỉnh sửa
    input.isEdited = true;

    // Lưu lịch sử chỉnh sửa
    input.historyInput.push({
      ...previousInputData,
      modified_at: new Date(),
    });

    // Lưu lại dự án với thông tin cập nhật
    await project.save();

    res.status(200).json({ message: "Input updated successfully", updatedInput: input });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.exportQR = async (req, res) => {
  try {

    // Tìm output dựa trên outputId
    const farmID = req.userId;
    const projectId = req.params.projectId;
    const outputId = req.params.outputId;

    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const output = project.output.id(outputId);
    if (!output) {
      return res.status(404).json({ message: "Output not found." });
    }

    const { amount, amount_perOne, npp } = output;

    // Tính số lượng sản phẩm
    const a = Math.floor(amount / amount_perOne);

    // Lưu trữ danh sách QR codes
    const qrCodes = [];

    // Tạo QR codes cho từng NPP
    if (npp && npp.length > 0) {
      npp.forEach((nppItem) => {
        if (nppItem.name) {
          const nppQty = nppItem.amount;
          for (let i = 0; i < nppQty; i++) {
            qrCodes.push({
              isScanned: false,
              time: new Date(),
              outputId,
              npp: nppItem.name,
              txScan: '',
            });
          }
        }
      });
    }

    // Tạo QR codes cho trường hợp khác
    const otherQty = a - qrCodes.length;
    for (let i = 0; i < otherQty; i++) {
      qrCodes.push({
        isScanned: false,
        time: new Date(),
        outputId,
        npp: 'other',
        txScan: '',
      });
    }

    // Lưu các QR codes vào cơ sở dữ liệu
    const savedQRs = await QR.insertMany(qrCodes);

    // Cập nhật trường exportQR của output thành true
    output.exportQR = true;
    await project.save();

    res.status(200).json({ message: 'QR codes exported successfully', qrCodes: savedQRs, projectOutput: project.output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const qrId = req.params.id;
    const clientId = req.params.clientId

    // Tìm QR code dựa trên qrId
    const qrCode = await QR.findById(qrId);

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Cập nhật trường isScanned thành true và gán thời gian quét
    qrCode.isScanned = true;
    qrCode.timeScanned = new Date();
    qrCode.clientId = clientId

    // Lưu lại QR code cập nhật vào cơ sở dữ liệu
    const updatedQR = await qrCode.save();

    res.status(200).json({ message: 'QR code scanned successfully', scannedQR: updatedQR });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// API để thêm cây
exports.addPlant = async (req, res) => {
  try {
    const farmID = req.userId;
    const { plantId } = req.body;

    if (!plantId) {
      return res.status(400).json({ message: 'Tên cây là bắt buộc' });
    }
    console.log("farm id: ", farmID)

    const farm = await Farm.findOne({ farmID });
    if(!farm) {
      return res.status(400).json({ message: 'Khong co farm' });
    }

    console.log("farm: ", farm)

    // Kiểm tra xem cây với tên đã tồn tại trong cơ sở dữ liệu chưa
    const existingPlant = await farm.plant.includes(plantId);

    if (existingPlant) {
      return res.status(400).json({ message: 'Cây với tên này đã tồn tại' });
    }

    // Thêm cây vào mảng plant của farm
    farm.plant.push(plantId);

    // Lưu farm đã được cập nhật vào cơ sở dữ liệu
    await farm.save();

    res.status(200).json({ message: 'Cây đã được thêm vào farm', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy danh sách cây
exports.getPlantsFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    // Tìm farm dựa trên farmId
    const farm = await Farm.findOne({farmID: farmId});

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Lấy thông tin id, name, image của các plant
    const plants = await Plant.find({ _id: { $in: farm.plant } }, 'id name image');

    res.status(200).json({ plants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

exports.addPlantCultivate = async (req, res) => {
  try {
    const farmId = req.userId;
    const {seed, plantId, price, plan } = req.body;

    if (!seed || !plan) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' });
    }

    // Tạo một PlantCultivate mới
    const newPlantCultivate = new PlantCultivate({ farmId, seed, price, plan, plantId });

    // Lưu PlantCultivate vào cơ sở dữ liệu
    const savedPlantCultivate = await newPlantCultivate.save();

    res.status(201).json({ message: 'PlantCultivate đã được thêm', plantCultivate: savedPlantCultivate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API endpoint để cập nhật thông tin của một PlantCultivate
exports.updatePlantCultivate = async (req, res) => {
  try {
    const farmId = req.userId;
    const { plantCultivateId, seed, price, plan } = req.body;

    if (!plantCultivateId || !seed || !plan) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' });
    }

    // Kiểm tra xem PlantCultivate có tồn tại không
    const existingPlantCultivate = await PlantCultivate.findOne({ _id: plantCultivateId, farmId });

    if (!existingPlantCultivate) {
      return res.status(404).json({ message: 'PlantCultivate không tồn tại hoặc không thuộc sở hữu của bạn' });
    }

    // Cập nhật thông tin của PlantCultivate
    existingPlantCultivate.seed = seed;
    existingPlantCultivate.price = price;
    existingPlantCultivate.plan = plan;

    // Lưu PlantCultivate đã cập nhật vào cơ sở dữ liệu
    const updatedPlantCultivate = await existingPlantCultivate.save();

    res.status(200).json({ message: 'PlantCultivate đã được cập nhật', plantCultivate: updatedPlantCultivate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

exports.addPlantCultivateToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const data = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.plan = data.plan;
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Add plan to project successfully', updatedProjectPlan: updatedProject.plan});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.updatePlantCultivateToProject = async (req, res) => {
  try {
    const farmID = req.userId; // Lấy farmID từ thông tin người dùng đã xác thực
    const projectId = req.params.projectId; // Lấy projectId từ tham số của tuyến đường
    const data = req.body;
    const project = await Project.findOne({ _id: new mongoose.Types.ObjectId(projectId), farmID: farmID })
    if (!project) {
      return res.status(403).send({ message: "Farm does not have access to this project." });
    }
    // Thêm quy trình vào dự án
    project.plan = data.plan;
    const updatedProject = await project.save();
    return res.status(200).json({ message: 'Update plan to project successfully', updatedProjectPlan: updatedProject.plan});
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ message: error });
  };
};

exports.getPlanFromProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Tìm dự án dựa trên projectId
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Trả về thông tin kế hoạch của dự án
    res.status(200).json({ plan: project.plan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API endpoint để lấy thông tin kế hoạch từ plantId
exports.getPlanInFarmFromPlantId = async (req, res) => {
  try {
    const { farmId, plantId } = req.params;

    // Tìm tất cả các plantCultivates dựa trên farmId và plantId
    const plantCultivates = await PlantCultivate.find({ farmId, plantId });

    if (!plantCultivates || plantCultivates.length === 0) {
      return res.status(404).json({ message: 'PlantCultivates not found' });
    }

    // Lấy tất cả các kế hoạch của các plantCultivates
    const plans = plantCultivates.map((plantCultivate) => plantCultivate.plan);

    res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API endpoint để lấy thông tin kế hoạch từ seed
exports.getPlanInFarmFromSeed = async (req, res) => {
  try {
    const { seed, farmId } = req.params;

    // Tìm thông tin cây trồng dựa trên seed
    const plantCultivate = await PlantCultivate.findOne({ seed, farmId });

    if (!plantCultivate) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Trả về thông tin kế hoạch của cây trồng
    res.status(200).json({ plan: plantCultivate.plan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
