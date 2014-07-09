'use strict';

var passport = require('passport'),
    api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    tasks = require('./controllers/tasks'),
    foo = require('./controllers/dropbox'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    passportConf = require('./config/passport');

/**
 * Application routes
 */
module.exports = function(app) {

  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  // Server User Routes
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

    // Server Task Routes
  app.get('/api/tasks', tasks.all);
  app.get('/api/tasks/active', tasks.active);

  app.post('/api/tasks', tasks.create);
  app.put('/api/tasks/:id', tasks.update);
  app.delete('/api/tasks/:id', tasks.delete);

    //Dropbox Routes
  app.get('/api/:provider', passportConf.isAuthenticated, passportConf.isAuthorized, foo.getDropbox);
  app.put('/api/:provider', passportConf.isAuthenticated, passportConf.isAuthorized, foo.updateFile);

    //Dropbox authorization
  app.get('/auth/dropbox',
    passport.authorize('dropbox-oauth2'));

  app.get('/auth/dropbox/callback', 
    passport.authorize('dropbox-oauth2', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/api/dropbox');
    });

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};