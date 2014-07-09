'use strict';

angular.module('myNewProjectApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Tasks',
      'link': '/tasks'
    }, {
      'title': 'Signup',
      'link': '/signup'
    }, {
      'title': 'Login',
      'link': '/login'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
