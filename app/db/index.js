const db = require("../models");
const dbConfig = require('../config/db.config')
const Role = db.role;

console.log(`mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Agritech",
    user: dbConfig.USERNAME,
    pass: dbConfig.PASSWORD
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount()
    .then(count => {
      if (count === 0) {
        const userRole = new Role({
          name: "farm"
        });

        const clientRole = new Role({
          name: "client"
        });

        const adminRole = new Role({
          name: "admin"
        });

        return Promise.all([userRole.save(), clientRole.save(), adminRole.save()]);
      }
    })
    .then(savedRoles => {
      if (savedRoles) {
        savedRoles.forEach(savedRole => {
          console.log(`added '${savedRole.name}' to roles collection`);
        });
      }
    })
    .catch(err => {
      console.error("Error when counting documents or saving roles", err);
    });
}

module.exports = {
  db
};
