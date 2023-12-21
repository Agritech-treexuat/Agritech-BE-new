const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models/index.js')
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }
    req.userId = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: 'User Not found.' })
      }

      return Role.find({
        _id: { $in: user.roles },
        name: 'admin'
      }).exec()
    })
    .then((roles) => {
      if (roles.length > 0) {
        next()
      } else {
        res.status(403).send({ message: 'Require Admin Role!' })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err })
    })
}

isClient = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: 'User Not found.' })
      }

      return Role.find({
        _id: { $in: user.roles },
        name: 'client'
      }).exec()
    })
    .then((roles) => {
      if (roles.length > 0) {
        next()
      } else {
        res.status(403).send({ message: 'Require Client Role!' })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err })
    })
}

isFarm = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: 'User Not found.' })
      }

      return Role.find({
        _id: { $in: user.roles },
        name: 'farm'
      }).exec()
    })
    .then((roles) => {
      if (roles.length > 0) {
        next()
      } else {
        res.status(403).send({ message: 'Require Farm Role!' })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err })
    })
}

const authJwt = {
  verifyToken,
  isAdmin,
  isClient,
  isFarm
}
module.exports = authJwt
