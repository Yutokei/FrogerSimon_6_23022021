  
const jwt = require('jsonwebtoken');
const User = require('../models/User')

require('dotenv').config()

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
        throw 'user ID non valable !';
    } else {
        next();
    }
  } catch (error) {
      res.status(401).json({ error: error | 'Requête non authentifié' })
  }
}