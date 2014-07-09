'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Task');

/**
 * Get Tasks
 */

var task = {
    //GET
  all : function(req, res) {
    return Task.find(function (err, tasks) {
      if (err) return res.send(400, err);
      res.json(tasks);
    });
  },
    //GET
  active : function (req, res) {
    return Task.find({ archived: false }, function (err, tasks) {
      if (err) return res.send(400, err);
      res.json(tasks);
    });
  },
    //POST
  create : function(req, res) {
    Task.create({ description: req.body.description }, function(err, newTask) {
      if (err) return res.send(400, err.errors.description.message);
      res.json(newTask);
    });
  },
    //PUT
  update : function(req, res) {
    Task.findById(req.params.id, function(err, task) {
      task.description = req.body.description;
      task.completed = req.body.completed;
      task.archived = req.body.archived;
      task.save(function(err) {
        if (err) return res.send(400, err);
        res.json(task);
      });
    });
  },
    //DELETE
  delete : function(req, res) {
    Task.findByIdAndRemove(req.params.id, function (err, task) {
      if (err) return res.send(400, err);
      res.json(task);
    });
  }

};

module.exports = task;