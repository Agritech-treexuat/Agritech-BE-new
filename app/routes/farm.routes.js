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
    "/farm/project/addImage/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.addImageToProject);

  app.post(
    "/farm/project/addOutput/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.addOutputToProject);

  app.post(
    "/farm/project/addExpect/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.addExpectToProject);

  app.post(
    "/farm/project/editProcess/:projectId/:processId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.editProcess);

  app.post(
    "/farm/project/editOutput/:projectId/:outputId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.editOutput);

  app.post(
    "/farm/project/editExpect/:projectId/:expectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.editExpect);

  app.post(
    "/farm/project/editInput/:projectId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.editInput);

  app.post(
    "/farm/project/exportQR/:projectId/:outputId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.exportQR);
    // Lay tat ca moi thu
  app.get("/farm/projects/:farmId", controller.getAllProjectsByFarmId);

  app.get("/farm/project/:projectId", controller.getProjectById);

  app.get("/farm/project/:projectId/process", controller.getProcesses);

  app.get("/farm/project/:projectId/image", controller.getImages);

  app.get("/farm/project/:projectId/output", controller.getOutputs);

  app.get("/farm/project/:projectId/expect", controller.getExpects);

  app.get("/farm/project/:projectId/input", controller.getInput);

  app.get('/farm/:farmId/projects', controller.getProjectsByFarmId);

  app.get("/farm/me", [authJwt.verifyToken], controller.getMyProfile);


};
