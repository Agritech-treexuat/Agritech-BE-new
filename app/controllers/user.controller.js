exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.')
}

exports.userBoard = (req, res) => {
  res.status(200).send('User Content.')
}

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.')
}

exports.clientBoard = (req, res) => {
  res.status(200).send('Client Content.')
}

exports.farmBoard = (req, res) => {
  res.status(200).send('Farm Content.')
}
