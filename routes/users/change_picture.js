const express = require('express');
const router = express.Router();
const upload = require('../../config/multer')
const ensureAuthenticated = require('../ensureAuthenticated');

let User = require('../../models/user');


router.post('/:id/change_picture', ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if(err) {
      req.flash('danger', err=='!img' ? 'Images Only!' : 'File is too large! (max 1mb)');
      res.redirect('back');
    } else {
      if(req.file == undefined) {
        req.flash('danger', 'Select your file!')
        res.redirect('back')
      } else {
        let user = {
          img_name: req.file.filename,
        };

        User.update({_id: req.params.id}, user, (err) => {
          if(err) {
            console.log(err);
          } else {
            req.flash('success', 'Profile picture updated')
            res.redirect('back');
          };
        });
      };
    };
  });
});

module.exports = router;
