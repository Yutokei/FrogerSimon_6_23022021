const Sauce = require('../models/Sauce');
const fs = require('fs');


//Création d'une sauce
exports.createSauce = (req, res, next) => {
  //On récupère le body de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  //On injecte le body dans notre schéma de sauce
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //On sauvegarde la nouvelle sauce
  sauce.save()
  .then(() => {res.status(201).json({ message: 'Vous avez envoyé la sauce!' })})
  .catch((error) => {res.status(400).json({ error: error })});
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // si l'image est modifiée, on supprime l'image actuel
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Vous avez modifié la recette !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
} else {
    // si l'image n'est pas modifiée
    const sauceObject = { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Vous avez modifié la recette !' }))
        .catch(error => res.status(400).json({ error }));
}
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée!' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Affiche toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        message: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error})});
};


//Fonction de like dislike des sauces
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    //cas: L'utilisateur retourne à 0 likes.
    case 0:                                                   
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          //Si l'utilisateur est dans le tableau like on retire le like de la sauce puis l'utilisateur du tableau Like.
          if (sauce.usersLiked.find( user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {         
              $inc: { likes: -1 },                           
              $pull: { usersLiked: req.body.userId }          
            })
              .then(() => { res.status(201).json({ message: "Vous avez dévalidé la sauce !"}); }) //code 201: created
              .catch((error) => { res.status(400).json({error}); });
          }
          //Si l'utilisateur est dans le tableau disLike on retire le disLike de la sauce puis l'utilisateur du tableau disLike.
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            })
              .then(() => { res.status(201).json({ message: "Une nouvelle chance pour cette sauce ?" }); })
              .catch((error) => { res.status(400).json({error}); });
          }
        })
        .catch((error) => { res.status(404).json({error}); });
      break;

    //Cas l'utilisateur like une sauce, il est ajouté dans le tableau usersLiked et le like passe à 1.
    case 1:                                                 
      Sauce.updateOne({ _id: req.params.id }, {             
        $inc: { likes: 1 },                                 
        $push: { usersLiked: req.body.userId }              
      })
        .then(() => { res.status(201).json({ message: "Vous voilà saucé" }); }) 
        .catch((error) => { res.status(400).json({ error }); });
      break;
    
    //Cas L'uilisateur dislike une sauce, il est ajouté dans le tableau usersDisLike et le like passe à -1
    case -1:                                     
      Sauce.updateOne({ _id: req.params.id }, {  
        $inc: { dislikes: 1 },                   
        $push: { usersDisliked: req.body.userId }
      })
        .then(() => { res.status(201).json({ message: "Vous l'avez désaucé" }); })
        .catch((error) => { res.status(400).json({ error }); }); 
      break;
    default:
      console.error("Very bad REQUEST");
  }
};