const multer = require('multer');
//extension envoyées par le FRONT récuperées dans le dossier images
const MIME_TYPES = {
	//
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

//indique à multer ou enregistrer les fichier entrant
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	}, // pas d'erreurs => dossier images

	filename: (req, file, callback) => {
		const name = file.originalname.split('').join('_'); // remplace espaces par _
		const extension = MIME_TYPES[file.mimetype]; //recupère l'extension
		callback(null, name + Date.now() + '.' + extension); // ajoute un timestamp avant l'extension
	},
});

module.exports = multer({ storage: storage }).single('image');
