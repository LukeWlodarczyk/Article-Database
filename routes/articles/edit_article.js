const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const ensureAuthenticated = require('../ensureAuthenticated');

let Article = require('../../models/article');

//Load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    };
    res.render('edit_article', {
      title: 'Edit article',
      article: article
    });
  });
});

router.post('/edit/:id', ensureAuthenticated, [
      check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
      check('body')
      .not()
      .isEmpty()
      .withMessage('Body is required'),
    ], (req, res) => {
        let title = req.body.title;
        let body = req.body.body;

        // Check for Errors
        const validationErrors = validationResult(req);
        let errors = [];
        if (!validationErrors.isEmpty()) {
          Object.keys(validationErrors.mapped()).forEach(field => {
            errors.push(validationErrors.mapped()[field]['msg']);
          });
        };

        if (errors.length) {
          req.flash('danger', errors);
          res.redirect('back');
        } else {
          let article = {};
          article.title = title;
          article.body = body;

          let query = {_id:req.params.id};

          Article.update(query, article, err => {
            if(err) {
              console.log(err);
            } else {
              req.flash('success', 'Article updated');
              res.redirect('/articles/'+req.params.id);
            };
          });
        };
      });


module.exports = router;
