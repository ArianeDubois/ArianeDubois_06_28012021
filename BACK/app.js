const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const bodyParser = require('body-parser');
const saucesRoutes = require('./routes/sauces');

//MONGODB CONNECTION
const mongoose = require('mongoose'); // instale mongoose
mongoose
	.connect(
		'mongodb+srv://ariane:sauces@cluster0.3ct7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); //l'origine qui a le droit d'accéder à notre api = tout le monde
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-with, Content, Accept, Content-Type, Authorization'
	); //on autorise certains headers
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // on autorise certaines méthodes

	next();
});

app.use(bodyParser.json()); //traduit les requete en objets utilisables

// ROUTES

app.use('/api/sauces', saucesRoutes);

app.use('/images', express.static(path.join(__dirname, 'images'))); // gère les req images.
app.use((req, res, next) => {
	res.json('réponse');
});

module.exports = app;
