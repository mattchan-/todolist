/*jshint camelcase: false */
'use strict';

angular.module('myNewProjectApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }])
  .controller('TaskCtrl', ['$scope', 'Task', 'socket', 'Dropbox', function ($scope, Task, socket, Dropbox) {
    $scope.activeTasks = Task.query();

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
    };

    $scope.archiveCompleted = function() {
      angular.forEach($scope.activeTasks, function(task) {
        if (!task.archived && task.completed) {
          task.archived = true;
          updateTask(task);
        }
      });
    };

    $scope.markAll = function(complete) {
      angular.forEach($scope.activeTasks, function(task) {
        if (task.completed !== complete) {
          task.completed = complete;
          updateTask(task);
        }
      });
    };

    $scope.deleteTask = function(task) {
      Task.delete({id: task._id}, function(data) {
        socket.emit('delete:task', data);
        var oldTasks = $scope.activeTasks;
        $scope.activeTasks = [];
        angular.forEach(oldTasks, function(task) {
          if (task._id !== data._id) {
            $scope.activeTasks.push(task);
            updateFile();
          }
        });
      });
    };

    /********** Helper Functions **********/

    function updateTask(task) {
      Task.update({id: task._id}, task, function(data) {
        socket.emit('update:task', data);
        updateFile();
      });
    }

    function updateFile() {
      var formattedTasks = '';
      angular.forEach($scope.activeTasks, function(task) {
        var buffer = [];
        buffer.push(task._id);
        buffer.push(task.description);
        buffer.push(task.archived);
        buffer.push(task.completed);
        buffer.push(task.created_at);
        buffer.push(task.updated_at);
        buffer = buffer.join(',');
        formattedTasks += buffer;
      });
      Dropbox.update({tasks: formattedTasks});
    }
  }]);