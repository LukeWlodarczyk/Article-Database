const express = require('express');
const router = express.Router();
const passport = require('passport');


//Login form
router.get('/login', (req, res) => {
  res.render('login');
})

//Login proccess
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    badRequestMessage: 'Missing credentials',
    failureFlash: true,
  })(req, res, next);
});

//Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login')
});


module.exports = router;
