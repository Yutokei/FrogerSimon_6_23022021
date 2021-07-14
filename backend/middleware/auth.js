const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
      // récupération du token dans le cookie de session
      const token = req.session.token;  
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