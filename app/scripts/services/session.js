'use strict';

angular.module('myNewProjectApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
