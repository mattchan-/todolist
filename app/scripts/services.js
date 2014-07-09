/* global io */
'use strict';

angular.module('myNewProjectApp')
  .factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }])
  .factory('Task', ['$resource', function($resource) {
    return $resource('/api/tasks/:taskController/:id',
      { taskController: '@taskController', id: '@id' },
      {
        post: { method: 'POST' },
        update: { method: 'PUT' },
        query: { method: 'GET', params: { taskController: 'active' }, isArray: true }
      }
    );
  }])
  .factory('Dropbox', ['$resource', function($resource) {
  return $resource('/api/dropbox/', {},
    {
      update: { method: 'PUT', params: { tasks: '@tasks' } }
    }
  );
}]);