const express = require('express');
const router = express.Router();

let register = require('./users/register');
let loginout = require('./users/loginout');
let reset_password = require('./users/reset_password');
let profile = require('./users/profile');
let all_users = require('./users/all_users');
let search_user = require('./users/search_user');
let change_picture = require('./users/change_picture');

router.use('/', register);
router.use('/', loginout);
router.use('/', reset_password);
router.use('/', all_users);
router.use('/', search_user);
router.use('/', profile);
router.use('/', change_picture);

module.exports = router;
