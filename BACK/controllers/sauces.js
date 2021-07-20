const Sauce = require('../models/sauce');
const fs = require('fs'); // donne accès au systeme de modification du systeme de fichier

// POST
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce); // convertie l'objet reçu du front en objet utilisable
	// delete req.body._id;
	delete sauceObject._id;
	const sauce = new Sauce({
		// ...req.body,
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //mofier l'url de l'image
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
		.catch((error) => res.status(400).json({ error }));
};

//GET ID
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(400).json({ error }));
};

// PUT modifier une sauce

exports.updateOneSauce = (req, res, next) => {
	const sauceObject = req.file // si req.file l'image a été modifiée dans la requete
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://$req.get('host')/images/${res.file.filename}`,
		  }
		: { ...req.body };

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject }) //met à jour le premier parametre
		.then(() => res.status(200).json({ message: 'Sauce modifiée avec succès' }))
		.cactht((error) => res.status(400).json({ error }));
};

//DELETE
//s'assurer que les fichiers ses uprime du serveru quand un utilisateur supprime son objet (si supprime de la bbd suprime du serveur et du dossier image)
exports.deleteOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1]; //récupère le nom précis de la sauce et determine l'ancienne image à supprimer du dossier images gràce à split
			fs.unlink(`images/${filename}`, () => {
				//une fois le fichier supprimé ..

				Sauce.deleteOne({ _id: req.params.id }) //suprime la sauce dont l'id corespond à celui de l'url
					.then((sauce) => res.status(200).json({ message: 'Sauce supprimée' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

//GET affiche les sauces présentent dans la base de données // n'affiche pas correctemetn toutes les données pb avec le model ?
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(400).json({ error }));
};
