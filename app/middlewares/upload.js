const util = require("util");
const Multer = require("multer");

let processFile = Multer({
  storage: Multer.memoryStorage(),
}).any();

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
