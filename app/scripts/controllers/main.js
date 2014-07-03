'use strict';

angular.module('myNewProjectApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }])
  .controller('TaskCtrl', ['$scope', '$http', 'Task', function ($scope, $http, Task) {
    $scope.activeTasks = Task.query();

    $scope.filterArchived = function(task) {
      return !task.archived;
    };

    $scope.createTask = function() {
      var task = { description: $scope.taskText };
      Task.post(task, function(data) {
        $scope.taskText = '';
        $scope.activeTasks.push(data);
      }, function(err) {
        console.log(err);
      });
    };

    $scope.completeTask = function(task) {
      task.completed = !task.completed;
      Task.update({id: task._id}, task);
    };

    $scope.markAll = function(complete) {
      angular.forEach($scope.activeTasks, function(task) {
        if (task.completed !== complete) {
          task.completed = complete;
          Task.update({id: task._id}, task);
        }
      });
    };

    $scope.archiveCompleted = function() {
      angular.forEach($scope.activeTasks, function(task) {
        if (!task.archived && task.completed) {
          task.archived = true;
          Task.update({id: task._id}, task);
        }
      });
    };

    $scope.deleteTask = function(task) {
      Task.delete({id: task._id}, function(data) {
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