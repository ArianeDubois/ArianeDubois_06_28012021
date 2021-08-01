const express = require('express');
const router = express.Router(); //enregistre dans un router
const sauceCtrl = require('../controllers/sauces'); // importe les actions du controlleur
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');
const isOwner = require('../middleware/isOwner');

// POST
router.post('/', auth, multer, sauceCtrl.createSauce);

//GET ID
router.get('/:id', auth, sauceCtrl.getOneSauce);

// PUT modifier une sauce
router.put('/:id', auth, isOwner, multer, sauceCtrl.updateOneSauce);

//POST J'AIME
router.post('/:id/like', auth, sauceCtrl.opinionOnSauce);

//DELETE
router.delete('/:id', auth, isOwner, sauceCtrl.deleteOneSauce);

//GET affiche les sauces présentent dans la base de données // n'affiche pas correctemetn toutes les données pb avec le model ?
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;
