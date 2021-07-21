const express = require('express');
const router = express.Router(); //enregistre dans un router
const userCtrl = require('../controllers/users');
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
