'use strict';

var api = require('./controllers/api'),
    task = require('./controllers/tasks'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  // Server Task Routes
  app.get('/api/tasks', task.allTasks);

  app.post('/api/tasks/create', task.createTask);

  app.post('/api/tasks/complete/:id', task.completeTask);

  app.delete('/api/tasks/delete/:id', task.deleteTask);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);

  app.route('/*')
    .get( index.index);
};