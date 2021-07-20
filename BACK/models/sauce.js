const mongoose = require('mongoose');
const sauceSchema = mongoose.Schema({
	//objet id mongodb auto
	userId: { type: String, require: true },
	name: { type: String, require: true },
	manufacturer: { type: String, require: true },
	description: { type: String, require: true },
	mainPepper: { type: String, require: true },
	imageUrl: { type: String, require: true },
	heat: { type: Number, require: true },
	likes: { type: Number, require: true }, //number defaut ?
	dislikes: { type: Number, require: true }, //number defaut ?
	usersLiked: [{ type: String, require: true }], // tab
	usersDisliked: [{ type: String, require: true }], //tab
});

module.exports = mongoose.model('Sauce', sauceSchema);
