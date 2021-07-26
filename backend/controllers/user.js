const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const cryptoJs = require('crypto-js')
require('dotenv').config

const User = require('../models/User');

exports.signup = (req, res, next) => {

/*
//Regex Email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if (!EMAIL_REGEX.test(req.body.email)){
    return res.status(400)({ error: 'email non valide'})
}

//Mot de passe entre 4 et 8 charatères, il doit contenir au moins un chiffre
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
if (!PASSWORD_REGEX.test(req.body.password)){
    return res.status(400)({ error:'Mot de passe non valide: il doit contenir entre 4 et 8 charactères et au moins un chiffre'})
}
*/

    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        let user = new User({
          email: cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTO_KEY).toString(),
          password: hash,
        });
        user
          .save()
          .then(() => {res.status(201).json({ message: "Vous êtes enregistré !" });})
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