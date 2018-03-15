const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

let User = require('../../models/user');


// Register form
router.get('/register', (req, res) => {
  res.render('register');
});

//Register proccess
router.post('/register', [
      check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .custom(( value ) => value.length > 1)
      .withMessage('Name is too short'),
      check('email')
      .not()
      .isEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid Email')
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
      check('username')
      .not()
      .isEmpty()
      .withMessage('Username is required')
      .custom(( value ) => value.length > 2)
      .withMessage('Username is too short')
      .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
          User.findOne({username:req.body.username}, (err, user) =>{
            if(err) {
              reject(new Error('Server Error'))
            }
            if(Boolean(user)) {
              reject(new Error('Username already in use'))
            }
            resolve(true)
          });
        });
      }),
      // Check Password
      check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .custom(( value ) => value.length > 5)
      .withMessage('Password is too short'),
      check('password2', 'Passwords do not match')
      .exists()
      .custom((value, { req }) => value === req.body.password)
    ], (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

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
          let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            img_name: '../uploads/user.png',
            register_date: new Date()
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) {
                console.log(err);
              };
              newUser.password = hash;
              newUser.save( err => {
                if(err) {
                  console.log(err);
                  return;
                } else {
                  req.flash('success', 'You are now registered and can log in!');
                  res.redirect('/users/login');
                };
              });
            });
          });
        };
      });

module.exports = router;
