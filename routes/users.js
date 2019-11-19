var express = require('express');
var router = express.Router();

var user_controller = require('../Controllers/userController');

router.get('/login', user_controller.get_login)

router.get('/signup', user_controller.get_signup)

router.post('/login', user_controller.post_login)

router.post('/signup', user_controller.post_signup)

router.get('/logout', user_controller.logout)

module.exports = router;
