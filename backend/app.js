const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet =require('helmet');
const cors = require('cors');
require('dotenv').config();

//Modules permettant de limiter le nombre de requêtes au serveur
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  //Fenêtre d'une heure
  windowMs: 60 * 60 * 1000,
  //Requête maximum de deux-mille.
  max: 2000,
  message: "Vous avez passez trop de temps dans la sauce, revenez dans une heure !"
});

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const Sauce = require('./models/Sauce');

const app = express();

//Connection au serveur Mongo DB
mongoose.connect(process.env.MONGO_SERVER,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(
    cors({
      //On autorise uniquement les requêtes du frontend
      origin: process.env.CORS_ORIGIN
    })
  )

  app.use(helmet());

 

  app.use(bodyParser.json())

  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);

  app.use(limiter)

  app.use(express.urlencoded({extended: true}));

  module.exports = app