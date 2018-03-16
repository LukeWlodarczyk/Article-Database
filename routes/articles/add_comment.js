const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const ensureAuthenticated = require('../ensureAuthenticated');

let Article = require('../../models/article');

// Add submit POST route
router.post('/:id/add_comment',ensureAuthenticated, [
      check('comment')
      .not()
      .isEmpty()
      .withMessage('Write your comment'),
    ], (req, res, next) => {

        // Check for Errors
        const validationErrors = validationResult(req);
        let errors = [];
        if (!validationErrors.isEmpty()) {
          Object.keys(validationErrors.mapped()).forEach(field => {
            errors.push(validationErrors.mapped()[field]['msg']);
          });
        }

        if (errors.length) {
          Article.findById(req.params.id, (err, article) => {
            if(err) {
              console.log(err);
            } else {
              req.flash('danger', errors);
              res.redirect('back');
            }
          })
        } else {
          let comment = {
            author: req.user.name,
            author_id: req.user.id,
            body: req.body.comment,
            date: new Date(),
          }

          Article.findById(req.params.id, (err, article) => {
            if(err) {
              console.log(err);
            } else {

              article.comments = [...article.comments, comment];
              let query = {
                _id: req.params.id
              }
              Article.update(query, article, err => {
                if(err) {
                  console.log(err);
                } else {
                  req.flash('success', 'Comment added');
                  res.redirect('/articles/'+req.params.id);
                };
              });
            }
          })

        };
      });

module.exports = router;
