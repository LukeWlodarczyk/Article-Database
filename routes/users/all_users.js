const express = require('express');
const router = express.Router();

let User = require('../../models/user');

// All users
router.get('/all', (req, res) => {
  User.find( {}, (err, users) => {
    if(err) {
      console.log(err);
    } else {
      res.render('all_users', {
        title: 'Users',
        users: users,
      });
    }
  })

});


module.exports = router
