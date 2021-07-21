const Sauce = require('../models/sauce');
const fs = require('fs'); // donne accès au systeme de modification du systeme de fichier
const { ESTALE } = require('constants');

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
	// si req.file l'image a été modifiée dans la requete
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		  }
		: { ...req.body };

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //met à jour le premier parametre
		.then(() => res.status(200).json({ message: 'Sauce modifiée' }))
		.catch((error) => res.status(400).json({ error }));
};

//POST J'AIME

//pb de compteur connection deconnection
//BUG USER, IL ENREGISTRE DES DONNÉES MULTIPLES AVEC LE MÊME COMPTE (NE SAUVEGARDE PAS MES CHOIX APRÈS DÉCONNECTION) + VALEUR NÉGATIVE
//factoriser et voir comment empecher de liker et disliker une sauce
exports.likeOneSauce = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId; //
	const sauceId = req.params.id;
	//recupère id de la sauce et check si user id deja liké
	Sauce.findOne({ _id: sauceId }).then((sauce) => {
		//si utilisateur n'a pas dejà liké et si like =1
		if (!sauce.usersLiked.includes(userId) && like === 1) {
			Sauce.updateOne(
				{ _id: sauceId },
				{ $inc: { likes: +1 }, $push: { usersLiked: userId } }
			)
				.then(() => res.status(200).json({ message: `like ajouté` }))
				.catch((error) => res.status(400).json({ error }));
		}
		//retirer un j'aime
		else if (sauce.usersLiked.includes(userId) && like === 0) {
			Sauce.updateOne(
				{ _id: sauceId },
				{ $inc: { likes: -1 }, $pull: { usersLiked: userId } }
			)
				.then(() => res.status(200).json({ message: `like retiré` }))
				.catch((error) => res.status(400).json({ error }));
		}
		//disliker
		else if (!sauce.usersDisliked.includes(userId) && like === -1) {
			Sauce.updateOne(
				{ _id: sauceId },
				{ $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
			)
				.then(() => res.status(200).json({ message: `dislike ajouté` }))
				.catch((error) => res.status(400).json({ error }));
		}
		//reiter un dislike
		else if (sauce.usersDisliked.includes(userId) && like === 0) {
			Sauce.updateOne(
				{ _id: sauceId },
				{ $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
			)
				.then(() => res.status(200).json({ message: `dislike retiré` }))
				.catch((error) => res.status(400).json({ error }));
		}
	}); //end of findOne=> .then
};
//  .catch((error) => res.status(400).json({ error }))

//MANQUE FONDoNE =>SAUCE ID COMPARE USER AVEC INCLUDE, VOIRE POUR SWITCH
// Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: like ,  dislikes: like} });
// if (like === 1) {
// 	Sauce.updateOne({ _id: sauceId }, { $inc: { likes: like }, $push: { usersLiked: userId } })

// 		.then(() => res.status(200).json({ message: `like ajouté` }))
// 		.catch((error) => res.status(400).json({ error }));
// } else if (like === 0) {
// 		Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
// 			.then(() => res.status(200).json({ message: `like retiré` }))
// 			.catch((error) => res.status(400).json({ error }));
// 	} else if (like === -1) {
// 		Sauce.updateOne(
// 			{ _id: sauceId },
// 			{ $inc: { dislikes: +1 }, $pull: { usersDisliked: userId } }
// 		)
// 			.then(() => res.status(200).json({ message: `dislike ajouté` }))
// 			.catch((error) => res.status(400).json({ error }));
// 	} else if (like === 0) {
// 		Sauce.updateOne(
// 			{ _id: sauceId },
// 			{ $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
// 		)
// 			.then(() => res.status(200).json({ message: `dislike retiré` }))
// 			.catch((error) => res.status(400).json({ error }));
// 	}
// };

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
