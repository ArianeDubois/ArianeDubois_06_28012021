const express = require('express');
const router = express.Router(); //enregistre dans un router
const sauceCtrl = require('../controllers/sauces'); // importe les actions du controlleur
const multer = require('../middleware/multer');

// POST
router.post('/', multer, sauceCtrl.createSauce);

//GET ID
router.get('/:id', multer, sauceCtrl.getOneSauce);

// PUT modifier une sauce
router.put('/:id', multer, sauceCtrl.updateOneSauce);

//DELETE
router.delete('/:id', multer, sauceCtrl.deleteOneSauce);

//GET affiche les sauces présentent dans la base de données // n'affiche pas correctemetn toutes les données pb avec le model ?
router.get('/', multer, sauceCtrl.getAllSauce);

module.exports = router;
