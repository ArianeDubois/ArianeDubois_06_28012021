const jwt = require('jsonwebtoken'); // proteger les routes

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // récupère uniquement le token - Bear
		const decodeToken = jwt.verify(token, process.env.DB_PASSWORD); // variable d'environemnt pour la clé du token
		const userId = decodeToken.userId;

		if (req.body.userId && req.body.userId !== userId) {
			// compare l'user requete grace au token
			throw 'Invalid User'; // envoie dans le catch
		} else {
			next(); //passe au prochain middleware => les controlleurs
		}
	} catch {
		res.status(401).json({ error: new Error('invalid request!') });
	}
};

// isOwner
