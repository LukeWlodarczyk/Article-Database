const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const ensureAuthenticated = require('../ensureAuthenticated');


//Bring in User Model
let User = require('../../models/user');
//Bring in Article Model
let Article = require('../../models/article');

// User profile
router.get('/:id', (req, res) => {

  User.findById(req.params.id, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      Article.find({author: req.params.id}, (err, articles) => {
        if(err) {
          console.log(err);
        } else {
          res.render('user_profile', {
            user_profile: user,
            articles: articles
          })
        }
      })
    }
  })
});


// User profile settings
router.get('/:id/settings',ensureAuthenticated, (req, res) => {
    if(req.user._id != req.params.id) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    } else {
      res.render('user_settings', {
        title: 'Settings'
      });
    }
});

router.post('/:id/settings',[
  check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Email is not valid')
  .custom((value, {req}) => {
    return new Promise((resolve, reject) => {
      User.findOne({email:req.body.email}, (err, user) => {
        if(err) {
          reject(new Error('Server Error'))
        }
        if(Boolean(user)) {
          reject(new Error('Email already in use'))
        }
        resolve(true)
      });
    });
  }),
  check('password')
  .not()
  .isEmpty()
  .withMessage('Password is required')
] ,(req, res) => {

  const validationErrors = validationResult(req);
  let errors = [];
  if (!validationErrors.isEmpty()) {
    Object.keys(validationErrors.mapped()).forEach(field => {
      errors.push(validationErrors.mapped()[field]['msg']);
    });
  }

  if(errors.length) {
    req.flash('danger', errors);
    res.redirect('back');
  } else {
    bcrypt.compare(req.body.password, req.user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        User.findOne({password: req.user.password}, (err, user) => {
          user.email = req.body.email;
          user.save( err => {
            if(err) {
              console.log(err);
            } else {
              req.flash('success', 'Your email has been changed');
              res.redirect('/users/'+req.user._id);
            }

          })
        })
      } else {
        req.flash('danger', 'Incorrect password');
        res.redirect('back');
      };
    });
  };

});


module.exports = router;
