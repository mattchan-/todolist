'use strict';

angular.module('myNewProjectApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  })
  .controller('TaskCtrl', function ($scope, $http) {
    $http.get('/api/tasks').success(function(allTasks) {
      $scope.allTasks = allTasks;
    });

    $scope.orderProp = ['completed', 'updated_at'];

    $scope.createTask = function() {
      $http.post('/api/tasks/create', { description: $scope.taskText })
        .success(function(data) {
          $scope.taskText = '';
          $scope.allTasks.push(data);
        })
        .error(function(data) {
          console.log(data);
        });
    };

    $scope.completeTask = function(task, taskId) {
      $http.post('/api/tasks/complete/' + taskId)
        .success(function(data) {
          $scope.allTasks.splice($scope.allTasks.indexOf(task), 1, data);
        });
    };

    $scope.deleteTask = function(task, taskId) {
      $http.delete('/api/tasks/delete/' + taskId)
        .success(function() {
          $scope.allTasks.splice($scope.allTasks.indexOf(task), 1);
        });
    };
  });