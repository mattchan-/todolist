'use strict';

angular.module('myNewProjectApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }])
  .controller('TaskCtrl', ['$scope', 'Task', 'socket', function ($scope, Task, socket) {
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
        console.log(data);
        socket.emit('create:task', data);
        $scope.activeTasks.push(data);
        $scope.taskText = '';
      }, function(err) {
        console.log(err);
      });
    };

    $scope.completeTask = function(task) {
      task.completed = !task.completed;
      Task.update({id: task._id}, task, function(data) {
        socket.emit('update:task', data);
      });
    };

    $scope.archiveCompleted = function() {
      angular.forEach($scope.activeTasks, function(task) {
        if (!task.archived && task.completed) {
          task.archived = true;
          Task.update({id: task._id}, task, function (data) {
            socket.emit('update:task', data);
          });
        }
      });
    };

    $scope.markAll = function(complete) {
      angular.forEach($scope.activeTasks, function(task) {
        if (task.completed !== complete) {
          task.completed = complete;
          Task.update({id: task._id}, task, function(data) {
            socket.emit('update:task', data);
          });
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
          }
        });
      });
    };
  }]);