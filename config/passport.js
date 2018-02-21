const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');


module.exports = passport => {
  //Local Strategy
  passport.use(new LocalStrategy( (username, password, done) => {
    //Match username
    let query = {username: username};
    User.findOne(query, (err, user) => {
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'User not found', type: 'danger'});
      };

      //Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password', type: 'danger'});
        };
      });
    });
  }));

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
