/*jshint camelcase: false */
'use strict';

angular.module('myNewProjectApp')
  .controller('DropboxCtrl', ['$scope', '$resource', 'Dropbox', 'Task', function ($scope, $resource, Dropbox, Task) {
    $scope.entries = Dropbox.query();
    $scope.tasks = Task.query();
    $scope.tasks.$promise.then(console.log($scope.tasks));

    var formattedTasks = '';
    $scope.updateFile = function() {
      angular.forEach($scope.tasks, function(task) {
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
    };
  }]);
