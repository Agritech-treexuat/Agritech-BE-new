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
  app.patch('/updateGardenStatus/:gardenId', [authJwt.verifyToken, authJwt.isFarm], controller.updateGardenStatus);
};
