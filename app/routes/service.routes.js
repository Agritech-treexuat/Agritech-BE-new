const { authJwt } = require("../middlewares");
const controller = require("../controllers/service.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/serviceTemplate/:farmId', controller.getAllServiceTemplates);
  app.post('/serviceTemplate/add', [authJwt.verifyToken, authJwt.isFarm], controller.addServiceTemplate);
  app.put('/serviceTemplate/update/:serviceTemplateId', [authJwt.verifyToken, authJwt.isFarm], controller.updateServiceTemplate);
  app.post('/serviceRequest/create', [authJwt.verifyToken, authJwt.isClient], controller.createServiceRequest);
  app.get('/serviceRequest/farm', controller.getFarmServiceRequests);
  app.patch('/serviceRequest/update/:requestId', [authJwt.verifyToken, authJwt.isFarm], controller.updateServiceRequestStatus);
};
