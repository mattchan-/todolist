'use strict';

angular.module('myNewProjectApp')
  .factory('Dropbox', ['$resource', function($resource) {
    return $resource('/api/dropbox/', {}, {
      update: {
        method: 'PUT',
        params: {
          tasks: '@tasks'
        }
      }
    });
  }]);