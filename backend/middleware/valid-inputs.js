const joi = require('@hapi/joi');

//Validation des données signup et login
const userSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().min(4).required()
});
exports.user = (req, res, next) => {
    const {error, value} = userSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "email ou mot de passe invalide" });
    } else {
        next();
    }
};

//Validation des données d'un sauce
const sauceSchema = joi.object({
    userId: joi.string().trim().length(24).required(),
    name: joi.string().trim().min(1).required(),
    manufacturer: joi.string().trim().min(1).required(),
    description: joi.string().trim().min(1).required(),
    mainPepper: joi.string().trim().min(1).required(),
    heat: joi.number().integer().min(1).max(10).required()
})
exports.sauce = (req, res, next) => {
    let sauce;
    if (req.file) {
        sauce = JSON.parse(req.body.sauce);
    } else {
        sauce = req.body;
    }
    
    const {error, value} = sauceSchema.validate(sauce);
    if (error) {
        res.status(422).json({ error: "Les données entrées sont invalides" });
    } else {
        next();
    }
}

//Validation d'une Id de sauce
const idSchema = joi.string().trim().length(24).required();
exports.id = (req, res, next) => {
    const {error, value} = idSchema.validate(req.params.id);
    if (error) {
        res.status(422).json({ error: "Sauce non existante" });
    } else {
        next();
    }  
}


 //Validation du like/dislike d'une sauce
const likeSchema = joi.object({
    userId: joi.string().trim().length(24).required(),
    like: joi.valid(-1, 0, 1).required()
});
exports.like = (req, res, next) => {
    const {error, value} = likeSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "Invalides" });
    } else {
        next();
    }
};