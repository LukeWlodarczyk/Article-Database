const express = require('express');
const router = express.Router();

//Article Model
let Article = require('../../models/article');
//User Model
let User = require('../../models/user');

//Get single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render('article', {
        article: article,
        author: user.name,
      });
    });
  });
});

module.exports = router;
