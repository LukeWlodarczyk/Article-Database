const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const ensureAuthenticated = require('../ensureAuthenticated');

//Article Model
let Article = require('../../models/article');

//Add route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_article', {
    title: 'Add article'
  });
})

// Add submit POST route
router.post('/add', [
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
        let author = req.user._id;
        let body = req.body.body;

        // Check for Errors
        const validationErrors = validationResult(req);
        let errors = [];
        if (!validationErrors.isEmpty()) {
          Object.keys(validationErrors.mapped()).forEach(field => {
            errors.push(validationErrors.mapped()[field]['msg']);
          });
        }

        if (errors.length) {
          req.flash('danger', errors);
          res.redirect('back');
        } else {
          let newArticle = new Article({
            title: title,
            author: author,
            body: body,
            date: new Date,
          });
          newArticle.save( err => {
            if(err) {
              console.log(err);
            } else {
              req.flash('success', 'Article added');
              res.redirect('/articles/'+newArticle._id);
            }
          });
        };
      });

module.exports = router;
