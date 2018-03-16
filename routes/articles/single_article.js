const express = require('express');
const router = express.Router();

let Article = require('../../models/article');
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
