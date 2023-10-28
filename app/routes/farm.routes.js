const { authJwt } = require("../middlewares");
const controller = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/farm/initProject",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.initProject
  );

  app.post(
    "/farm/project/addProcess/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.addProcessToProject);

  app.post(
    "/farm/project/addOutput/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.addOutputToProject);

  app.get("/farm/projects/:farmId", controller.getAllProjectsByFarmId);

  app.get("/farm/project/:projectId", controller.getProjectById);

  app.get("/farm/project/:projectId/process", controller.getProcessesByDate);



};
