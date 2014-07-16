'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    _ = require('underscore'),
    config = require('./config'),
    LocalStrategy = require('passport-local').Strategy,
    DropboxStrategy = require('passport-dropbox-oauth2').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    var accessToken;
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);

      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Incorrect user name or password.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new DropboxStrategy({
    clientID: config.dropbox.clientId,
    clientSecret: config.dropbox.clientSecret,
    callbackURL: config.dropbox.redirectUrl,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findById(req.user._id, function (err, user) {
      user.tokens.push({ kind: 'dropbox', accessToken: accessToken, uid: profile.id , cursor: '' });
      user.save(function() {
        done(err, user);
      });
    });
  }
));

/**
 * Login Required middleware.
 */

passport.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */

passport.isAuthorized = function(req, res, next) {
  var provider = req.params.provider;
  if (_.findWhere(req.user.tokens, { kind: provider }))
    next();
  else
    res.redirect('/auth/' + provider);
};


module.exports = passport;