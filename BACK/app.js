const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); /*Variables d'environnement */
//SECURE
const helmet = require('helmet'); //secure express app by setting various HHTP headers
const rateLimit = require('express-rate-limit'); //limit repeated requests to public APIs

const app = express();
const bodyParser = require('body-parser');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//MONGODB CONNECTION
const mongoose = require('mongoose'); // instale mongoose

process.env.DBMONGO_URI;
mongoose
	.connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }) // variable nevironnment fichier dotenv
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-with, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json()); //traduit le body des requetes en objets utilisables

//HELMET
app.use(helmet());

//RATE-LIMIT
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: 'You exceeded 100 requests in 15 minuts limit!',
	headers: true,
});
// only apply to requests that begin with /api/login
app.use('/api/login', apiLimiter); // routes ?

// ROUTES
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images'))); // gère les req images.

module.exports = app;
