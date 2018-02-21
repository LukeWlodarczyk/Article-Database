const express = require('express');
const router = express.Router();

let add_article = require('./articles/add_article');
let delete_article = require('./articles/delete_article');
let edit_article = require('./articles/edit_article');
let single_article = require('./articles/single_article');
let add_comment = require('./articles/add_comment');
let search_article = require('./articles/search_article');

router.use('/', add_article);
router.use('/', delete_article);
router.use('/', edit_article);
router.use('/', add_comment);
router.use('/', search_article);
router.use('/', single_article);

module.exports = router;
