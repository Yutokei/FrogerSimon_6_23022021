const Sauce = require('../models/Sauce');
const fs = require('fs');


//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
      ...sauceObject,
      imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
  });
  sauce.save()
  .then(() => {res.status(201).json({ message: 'Vous avez envoyé la sauce!' })})
  .catch((error) => {res.status(400).json({ error: error })});
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    // si l'image est modifiée, on supprime l'image actuel
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
} else {
    // si l'image n'est pas modifiée
    const sauceObject = { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
        .catch(error => res.status(400).json({ error }));
}
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageURL.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => {res.status(200).json({message: 'Sauce supprimé !'})})
          .catch((error) => {res.status(400).json({ error: error})})})
    })
    .catch(error => res.status(500).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error})});
};