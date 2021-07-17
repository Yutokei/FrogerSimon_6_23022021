const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const cryptoJs = require('crypto-js')
require('dotenv').config

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        let user = new User({
          email: cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTO_KEY).toString(),
          password: hash,
        });
        console.log(user)
        user
          .save()
          .then(() => {
            res.status(201).json({ message: "User created !" });
          })
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTO_KEY).toString() })
    .then(user => {
        if (!user)  {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwtUtils.generateToken(user._id)
            })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
};