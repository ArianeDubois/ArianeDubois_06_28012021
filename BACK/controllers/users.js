const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const crypto = require('crypto-js'); //crypto allows you to hash plain texts before storing them in the database

//hasher le mot de passe avant de l'envoyer
exports.signup = (req, res, next) => {
	const cryptoMail = crypto.HmacSHA1(req.body.email, process.env.DB_MAIL_KEY).toString();

	if (validator.validate(req.body.email)) {
		//verifie le mail avant de l'envoyer
		bcrypt.hash(req.body.password, 10).then((hash) => {
			const user = new User({
				email: cryptoMail,
				password: hash,
			});
			user.save() // enregistre user dans la base de donnée
				.then(() => res.status(201).json({ message: 'mot de passe crypté' })) //user create
				.catch((error) => res.status(400).json({ error }));
		});
	} else {
		throw new Error('Le mail est invalide');
	}
};

exports.login = (req, res, next) => {
	const cryptoMail = crypto.HmacSHA1(req.body.email, process.env.DB_MAIL_KEY).toString();
	User.findOne({ email: cryptoMail }) // compare le modele de la base de donnée avec le mail envoyé depuis le front
		.then((user) => {
			if (!user) {
				// si le mail n'est pas trouvé, renvoie une erreur 4001 // ! error tel quelle ou new
				return res.status(401).json({ error: new Error('utilisateur incorrecte!') });
			}
			bcrypt
				.compare(req.body.password, user.password) //vérifie le mot de passe saisie ave le mdp enregistré
				.then((valid) => {
					if (!valid) {
						return res
							.status(401)
							.json({ error: new Error('mot de passe incorrecte!') });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							//fonction d'encodage
							{ userId: user._id },
							process.env.DB_PASSWORD, // mdp correct = renvoie l'id de l'utilisateur avec un token
							{ expiresIn: '24h' }
						),
					});
				})
				.catch((error) => res.status(500).json({ error })); // erreur serveur bcrypt
		})
		.catch((error) => res.status(500).json({ error })); // erreur findOne
};
