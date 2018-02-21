const express = require('express');
const router = express.Router();

//Article Model
let Article = require('../../models/article');

//Search article
router.get('/search', (req, res) => {
  Article.find({title: req.query.title}, (err, articles) => {
    res.render('index', {
      title: 'Found articles',
      articles: articles
    });
  });
});

module.exports = router;
