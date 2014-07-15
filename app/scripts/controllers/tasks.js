/*jshint camelcase: false */
'use strict';

angular.module('myNewProjectApp')
  .controller('TaskCtrl', ['$scope', 'Task', 'socket', 'Dropbox', 'Auth', function ($scope, Task, socket, Dropbox, Auth) {
    $scope.activeTasks = Task.query(function(data) {
      console.log(data);
    });

    socket.on('webhook', function(data) {
      $scope.activeTasks = data;
    });

    socket.on('create:task', function(data) {
      $scope.activeTasks.push(data);
    });

    socket.on('update:task', function(data) {
      var oldTasks = $scope.activeTasks;
      $scope.activeTasks = [];
      angular.forEach(oldTasks, function(task) {
        if (task._id !== data._id) {
          $scope.activeTasks.push(task);
        } else {
          $scope.activeTasks.push(data);
        }
      });
    });

    socket.on('delete:task', function(data) {
      var oldTasks = $scope.activeTasks;
      $scope.activeTasks = [];
      angular.forEach(oldTasks, function(task) {
        if (task._id !== data._id) {
          $scope.activeTasks.push(task);
        }
      });
    });

    $scope.filterArchived = function(task) {
      return !task.archived;
    };

    $scope.createTask = function() {
      var task = { description: $scope.taskText };
      Task.post(task, function(data) {
        socket.emit('create:task', data);
        $scope.activeTasks.push(data);
        $scope.taskText = '';
        updateFile();
      }, function(err) {
        console.log(err);
      });
    };

    $scope.completeTask = function(task) {
      task.completed = !task.completed;
      updateTask(task);
      updateFile();
    };

    $scope.archiveCompleted = function() {
      angular.forEach($scope.activeTasks, function(task) {
        if (!task.archived && task.completed) {
          task.archived = true;
          updateTask(task);
        }
      });
      updateFile();
    };

    $scope.markAll = function(complete) {
      angular.forEach($scope.activeTasks, function(task) {
        if (task.completed !== complete) {
          task.completed = complete;
          updateTask(task);
        }
      });
      updateFile();
    };

    $scope.deleteTask = function(task) {
      Task.delete({id: task._id}, function(data) {
        socket.emit('delete:task', data);
        var oldTasks = $scope.activeTasks;
        $scope.activeTasks = [];
        angular.forEach(oldTasks, function(task) {
          if (task._id !== data._id) {
            $scope.activeTasks.push(task);
          }
        });
        updateFile();
      });
    };

    $scope.dropboxConnected = function() {
      if (Auth.isLoggedIn()) {
        return Auth.dropboxConnected();
      }
    };

    /********** Helper Functions **********/

    function updateTask(task) {
      Task.update({id: task._id}, task, function(data) {
        socket.emit('update:task', data);
      });
    }

    function updateFile() {
      Dropbox.update({tasks: JSON.stringify($scope.activeTasks)});
    }
  }]);