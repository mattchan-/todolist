'use strict';

angular.module('myNewProjectApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Tasks',
      'link': '/tasks'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];

    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
    };

  });
