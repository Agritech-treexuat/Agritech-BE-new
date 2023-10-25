const express = require("express");
const cors = require("cors");
const dbConfig = require('./app/config/db.config')

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to huy application." });
});

const db = require("./app/models");
const Role = db.role;

console.log(`mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
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
            name: "user"
          });

          const moderatorRole = new Role({
            name: "moderator"
          });

          const adminRole = new Role({
            name: "admin"
          });

          return Promise.all([userRole.save(), moderatorRole.save(), adminRole.save()]);
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


// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
