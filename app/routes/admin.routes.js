const { authJwt } = require('../middlewares')
const controller = require('../controllers/admin.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post('/admin/plants', [authJwt.verifyToken, authJwt.isAdmin], controller.addPlant)

  app.get('/plants', controller.getPlants)

  app.post('/admin/seeds', [authJwt.verifyToken, authJwt.isAdmin], controller.addSeed)

  app.get('/seeds', controller.getAllSeeds)

  app.get('/seeds/:plantId', controller.getSeedsByPlantId)

  app.post('/admin/cultivative', [authJwt.verifyToken, authJwt.isAdmin], controller.addCultivative)

  app.get('/cultivative', controller.getAllCultivative)

  app.get('/cultivative/:id', controller.getCultivativeById)

  app.post('/admin/plantCultivates', [authJwt.verifyToken, authJwt.isAdmin], controller.addPlantCultivate)

  app.post('/farm/plantCultivates', [authJwt.verifyToken, authJwt.isFarm], controller.addPlantCultivate)

  app.get('/plantCultivates', controller.getAllPlantCultivate)

  app.get('/plantCultivates/:farmId/:seed', controller.getPlantCultivateByFarmAndSeed)
}
