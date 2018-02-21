const express = require('express');
const router = express.Router();

//User Model
let User = require('../../models/user');

//Search User
router.get('/all/search', (req, res) => {

  User.find({name: req.query.user}, (err, user) => {
    res.render('all_users', {
      title: 'Found user',
      users: user
    });
  });
});

module.exports = router;
