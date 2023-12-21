const { authJwt } = require('../middlewares')
const controller = require('../controllers/plant.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post('/farm/plantCultivates', [authJwt.verifyToken, authJwt.isFarm], controller.addPlantCultivate)

  app.put('/farm/plantCultivates', [authJwt.verifyToken, authJwt.isFarm], controller.updatePlantCultivate)

  app.post('/farm/plant', [authJwt.verifyToken, authJwt.isFarm], controller.addPlant)

  app.get('/farm/planInFarmFromPlant/:farmId/:plantId', controller.getPlanInFarmFromPlantId)

  app.get('/farm/planInFarmFromSeed/:farmId/:seed', controller.getPlanInFarmFromSeed)

  app.get('/farm/plant/:farmId', controller.getPlantsFarm)
}
