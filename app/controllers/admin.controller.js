// Import cần thiết
const Farm = require('../models/farm.model');
const Project = require('../models/project.model');
const {mongoose} = require('mongoose')

const User = require('../models/user.model');
const Role = require('../models/role.model');
const Plant = require('../models/plant.model');
const Seed = require('../models/seed.model');
const PlantCultivate = require('../models/plantCultivate.model');
const Cultivative = require('../models/cultivative.model');

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

// API để thêm cây
exports.addPlant = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên cây là bắt buộc' });
    }

    // Kiểm tra xem cây với tên đã tồn tại trong cơ sở dữ liệu chưa
    const existingPlant = await Plant.findOne({ name });

    if (existingPlant) {
      return res.status(400).json({ message: 'Cây với tên này đã tồn tại' });
    }

    // Tạo một cây mới
    const newPlant = new Plant({ name });

    // Lưu cây vào cơ sở dữ liệu
    const savedPlant = await newPlant.save();

    res.status(201).json({ message: 'Cây đã được thêm', plant: savedPlant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy danh sách cây
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find(); // Lấy tất cả cây từ cơ sở dữ liệu

    res.status(200).json({ plants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để thêm seed
exports.addSeed = async (req, res) => {
  try {
    const { plantId, name, images } = req.body;

    if (!plantId || !name) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' });
    }

    // Kiểm tra xem có seed nào trùng tên và plantId chưa
    const existingSeed = await Seed.findOne({ plantId, name });

    if (existingSeed) {
      return res.status(400).json({ message: 'Seed với tên và plantId đã tồn tại' });
    }

    // Tạo một seed mới
    const newSeed = new Seed({ plantId, name, images });

    // Lưu seed vào cơ sở dữ liệu
    const savedSeed = await newSeed.save();

    res.status(201).json({ message: 'Seed đã được thêm', seed: savedSeed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy tất cả seed
exports.getAllSeeds = async (req, res) => {
  try {
    const seeds = await Seed.find(); // Lấy tất cả seed từ cơ sở dữ liệu

    res.status(200).json({ seeds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy các seed từ plantId
exports.getSeedsByPlantId = async (req, res) => {
  try {
    const { plantId } = req.params;

    if (!plantId) {
      return res.status(400).json({ message: 'plantId bị thiếu' });
    }

    const seeds = await Seed.find({ plantId }); // Lấy các seed có plantId tương ứng

    res.status(200).json({ seeds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để thêm Cultivative
exports.addCultivative = async (req, res) => {
  try {
    const { name, type, note, images } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Tên và loại của Cultivative là bắt buộc' });
    }

    // Kiểm tra xem đã tồn tại Cultivative với cùng name và type hay chưa
    const existingCultivative = await Cultivative.findOne({ name, type });

    if (existingCultivative) {
      return res.status(400).json({ message: 'Cultivative với tên và loại này đã tồn tại' });
    }

    // Tạo một Cultivative mới
    const newCultivative = new Cultivative({ name, type, note, images });

    // Lưu Cultivative vào cơ sở dữ liệu
    const savedCultivative = await newCultivative.save();

    res.status(201).json({ message: 'Cultivative đã được thêm', cultivative: savedCultivative });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy tất cả Cultivative
exports.getAllCultivative = async (req, res) => {
  try {
    const allCultivative = await Cultivative.find();

    res.status(200).json({ cultivatives: allCultivative });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy Cultivative dựa vào id
exports.getCultivativeById = async (req, res) => {
  try {
    const { id } = req.params;

    const cultivative = await Cultivative.findById(id);

    if (!cultivative) {
      return res.status(404).json({ message: 'Không tìm thấy Cultivative' });
    }

    res.status(200).json({ cultivative });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để thêm PlantCultivate
exports.addPlantCultivate = async (req, res) => {
  try {
    const farmId = req.userId;
    const {seedId, price, plan } = req.body;

    if (!seedId || !plan) {
      return res.status(400).json({ message: 'Thông tin bị thiếu' });
    }

    // Tạo một PlantCultivate mới
    const newPlantCultivate = new PlantCultivate({ farmId, seedId, price, plan });

    // Lưu PlantCultivate vào cơ sở dữ liệu
    const savedPlantCultivate = await newPlantCultivate.save();

    res.status(201).json({ message: 'PlantCultivate đã được thêm', plantCultivate: savedPlantCultivate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy tất cả PlantCultivate
exports.getAllPlantCultivate = async (req, res) => {
  try {
    const allPlantCultivate = await PlantCultivate.find();

    res.status(200).json({ plantCultivates: allPlantCultivate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// API để lấy tất cả PlantCultivate từ farmId và seedId
exports.getPlantCultivateByFarmAndSeed = async (req, res) => {
  try {
    const { farmId, seedId } = req.params;

    const plantCultivates = await PlantCultivate.find({ farmId, seedId });

    res.status(200).json({ plantCultivates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
