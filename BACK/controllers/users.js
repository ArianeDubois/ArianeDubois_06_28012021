const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//hasher le mot de passe avant de l'envoyer
exports.signup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then((hash) => {
		const user = new User({
			email: req.body.email,
			password: hash,
		});
		user.save() // enregistre user dans la base de donnée

			.then(() => res.status(201).json({ message: 'mot de passe crypté' })) //user create
			.catch((error) => res.status(400).json({ error }));
	});
};

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email }) // compare le modele de la base de donnée avec le mail envoyé depuis le front
		.then((user) => {
			if (!user) {
				// si le mail n'est pas trouvé, renvoie une erreur 4001
				return res.status(401).json({ error: 'Utilisateur non trouvé !' });
			}
			bcrypt
				.compare(req.body.password, user.password) //vérifie le mot de passe saisie ave le mdp enregistré
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: 'Mot de passe incorrect !' });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							//fonction d'encodage
							{ userId: user._id },
							'TOKEN', // mdp correct = renvoie l'id de l'utilisateur avec un token
							{ expiresIn: '24h' }
						),
					});
				})
				.catch((error) => res.status(500).json({ error })); // erreur serveur bcrypt
		})
		.catch((error) => res.status(500).json({ error })); // erreur find One
};

// utiliser l'onglet reseau de la console pour verifier le token
