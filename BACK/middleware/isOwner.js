const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

module.exports = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			try {
				const token = req.headers.authorization.split(' ')[1]; // récupère uniquement le token - Bear
				const decodeToken = jwt.verify(token, process.env.DB_PASSWORD);
				const userId = decodeToken.userId;

				if (sauce.userId !== userId) {
					//verifie si l'user id de la sauce est différent du token headers alors l'utilisateur n'est pas propriétaire
					throw 'unauthorized user';
				} else {
					next();
				}
			} catch {
				res.status(403).json({ error: new Error('unauthorized user!') });
			}
		})
		.catch((error) => res.status(500).json({ error })); // erreur findOne
};
