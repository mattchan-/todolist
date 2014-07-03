'use strict';

angular.module('myNewProjectApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/tasks', {
        templateUrl: 'partials/tasks',
        controller: 'TaskCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  })
  .factory('Task', ['$resource', function($resource) {
    return $resource('/api/tasks/:taskController/:id',
      { taskController: '@taskController', id: '@id' },
      {
        post: { method: 'POST' },
        update: { method: 'PUT' },
        query: { method: 'GET', params: { taskController: 'active' }, isArray: true }
      }
    );
  }]);