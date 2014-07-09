'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    _ = require('underscore'),
    secrets = require('./secrets'),
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
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);
      
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new DropboxStrategy({
    clientID: secrets.dropbox.clientId,
    clientSecret: secrets.dropbox.clientSecret,
    callbackURL: secrets.dropbox.redirectUrl,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findById(req.user._id, function (err, user) {
      user.tokens.push({ kind: 'dropbox', accessToken: accessToken });
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
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};


module.exports = passport;