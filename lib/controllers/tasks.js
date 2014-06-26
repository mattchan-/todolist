'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Task');

/**
 * Get Tasks
 */

var task = {
  allTasks : function(req, res) {
    return Task.find(function (err, tasks) {
      if (!err) {
        return res.json(tasks);
      } else {
        return res.send(err);
      }
    });
  },

  createTask : function(req, res) {
    Task.create({ description: req.body.description }, function(err, newTask) {
      if (err) return res.send(err);
      res.json(newTask);
    });
  },

  completeTask : function(req, res) {
    Task.findById(req.params.id , function(err, task) {
      if (err) {
        return res.send(err);
      } else {
        return Task.findByIdAndUpdate({
          _id: req.params.id
        }, { $set: {
            completed: !task.completed,
            updated_at: Date.now()
          } 
        }, function (err, task) {
          if (err) {
            return res.send(err);
          } else {
            return res.json(task);
          }
        }); 
      }
    });
  },

  deleteTask : function(req, res) {
    Task.findByIdAndRemove(req.params.id, function (err, task) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(task);
      }
    });
  }

};

module.exports = task;