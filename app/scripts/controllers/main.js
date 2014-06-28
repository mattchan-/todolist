'use strict';

angular.module('myNewProjectApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }])
  .controller('TaskCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/tasks').success(function(allTasks) {
      $scope.allTasks = allTasks;
    });

    $scope.orderProp = ['completed', 'updated_at'];

    $scope.createTask = function() {
      $http.post('/api/tasks/create', { description: $scope.taskText })
        .success(function(data) {
          $scope.taskText = '';
          $scope.allTasks.push(data);
        });
    };

    $scope.completeTask = function(task) {
      $http.post('/api/tasks/complete/' + task._id);
    };

    $scope.deleteTask = function(task) {
      $http.delete('/api/tasks/delete/' + task._id)
        .success(function(data) {
          var oldTasks = $scope.allTasks;
          $scope.allTasks = [];
          angular.forEach(oldTasks, function(task) {
            if (task._id !== data._id) {
              $scope.allTasks.push(task);
            }
          });
        });
    };

  }]);