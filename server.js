const express = require('express')
const cors = require('cors')
const db = require('./app/db')

const app = express()
app.use(cors())

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field)
})

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to huy application.' })
})

// const multer = require('multer');
// const path = require('path');
// // Cấu hình multer cho việc tải lên
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Thư mục lưu trữ ảnh
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post('/upload', upload.single('logo'), (req, res) => {
//   res.status(200).json({ message: 'File uploaded successfully' });
// });

// routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/farm.routes')(app)
require('./app/routes/admin.routes')(app)
require('./app/routes/service.routes')(app)
require('./app/routes/garden.routes')(app)
require('./app/routes/plant.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
