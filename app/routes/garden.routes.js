const { authJwt } = require("../middlewares");
const controller = require("../controllers/garden.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/garden/:farmId', controller.getGardensByFarmId);
  app.get('/garden/:farmId/:gardenId', controller.getGardenByGardenId);
  app.patch('/updateGardenStatus/:gardenId', [authJwt.verifyToken, authJwt.isFarm], controller.updateGardenStatus);
  app.get('/projects/:gardenId', controller.getProjectsByGardenId);
  app.get('/gardenPlantFarming/:gardenId', controller.getPlantFarmingByGardenId);
  app.post(
    "/farm/createProjectGarden/:gardenId",
    [authJwt.verifyToken, authJwt.isFarm],
    controller.createProjectGarden
  );
};
