'use strict';

import angular from 'angular';
import 'angular-route';
import './templates';

angular.module('app', ['ngRoute', 'templates']);

angular.module('app')

  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider
      .when('/', {templateUrl: 'home.html'})
      .when('/gists', {controller: 'GithubCtrl', templateUrl: 'gists.html'})
      .when('/swag', { templateUrl: 'swag.html'})
      .when('/swank', { templateUrl: 'swank.html'})
  })

  .controller('GithubCtrl', function ($scope, $sce, GithubSvc) {
    GithubSvc.gists().then(function (data) {
      $scope.gistData = [];
      angular.forEach(data, function (d) {
        $scope.gistData.push({
          "data": d,
          "description": $sce.trustAsHtml(d.description)
        });
      });
    })
  })

  .service('GithubSvc', function ($http) {
    this.gists = function () {
      return $http.get('https://api.github.com/gists/public', { cache: true })
      .then(function (response) {
        return response.data
      })
    }
  })
