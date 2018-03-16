const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

//Bring in Article Model
let User = require('../../models/user');


router.get('/login/forgot', (req, res) => {
  res.render('forgot')
});

router.post('/login/forgot', (req, res, next) => {
  async.waterfall([
    done => {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/users/login/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {
      let smtpTransport = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
          user: 'test4563@yahoo.com',
          pass: 'admin123456'
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'test4563@yahoo.com',
        subject: 'Password Reset',
        text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.
         Please click on the following link, or paste this into your browser to complete the process:
         http://${req.headers.host}/users/reset/${token}
         If you did not request this, please ignore this email and your password will remain unchanged.`
      };
      smtpTransport.sendMail(mailOptions, err => {
        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.redirect('/users/login/forgot');
        done(err, 'done');
      });
    }
  ], err => {
    if (err) return next(err);
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/login/forgot');
    }
    res.render('reset');
  });
});

router.post('/reset/:token',[
  check('password')
  .not()
  .isEmpty()
  .withMessage('Password is required')
  .custom(( value ) => /[A-Z]/.test(value))
  .withMessage('Password should contain at least one capital letter')
  .custom(( value ) => /[0-9]/.test(value))
  .withMessage('Password should contain at least one numeric character')
  .custom(( value ) => value.length > 5)
  .withMessage('Password is too short'),
  check('password2')
  .not()
  .isEmpty()
  .withMessage('Password confirmation is required')
  .custom((value, { req }) => value === req.body.password)
  .withMessage('Passwords do not match')
], (req, res) => {

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
    async.waterfall([
      done => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/users/login/forgot');
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if(err) {
                console.log(err);
              };
              user.password = hash;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save( err => {
                if(err) {
                  console.log(err);
                  return;
                }
                req.logIn(user, function(err) {
                  done(err, user);
                });

              });
            });
          });
        });
      },
      (user, done) => {
        let smtpTransport = nodemailer.createTransport({
          service: 'Yahoo',
          auth: {
            user: 'test4563@yahoo.com',
            pass: 'admin123456'
          }
        });
        let mailOptions = {
          to: user.email,
          from: 'test4563@yahoo.com',
          subject: 'Your password has been changed!',
          text: `Hello ${user.name},
            This is a confirmation that the password for your account has just been changed.`
        };
        smtpTransport.sendMail(mailOptions, err => {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], err => {
      console.log(err);
      res.redirect('/');
    });
  };
});

module.exports = router;
