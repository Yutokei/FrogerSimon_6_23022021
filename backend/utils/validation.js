const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if (!EMAIL_REGEX.test(email)){
    return res.status(400)({ error: 'email non valide'})
}

//Mot de passe entre 4 et 8 charatères, il doit contenir au moins un chiffre
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
if (!PASSWORD_REGEX.test(password)){
    return res.status(400)({ error: 'Mot de passe non valide: il doit contenir entre 4 et 8 charactères et au moins un chiffre'})
}
