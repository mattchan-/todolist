'use strict';

angular.module('myNewProjectApp')
  .factory('Task', ['$resource', function($resource) {
    return $resource('/api/tasks/:taskController/:id', {
      taskController: '@taskController',
      id: '@id'
    }, {
      post: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          taskController: 'active'
        },
        isArray: true
      }
    });
  }]);