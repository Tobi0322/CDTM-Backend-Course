var app = angular.module('taskApp', ['ngRoute']);


app.config(function($locationProvider, $routeProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
    .when('/', {
      templateUrl: 'app/views/main.html',
      controller: 'mainCtrl',
      access: {restricted: true}
    })
    .when('/home', {
      templateUrl: 'app/views/landing.html',
      controller: 'homeCtrl',
      access: {restricted: false}
    })
    .when('/logout', {
      redirectTo: '/'
    })
    .when('/login', {
      templateUrl: 'app/views/login.html',
      controller: 'loginCtrl',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'app/views/register.html',
      controller: 'registerCtrl',
      access: {restricted: false}
    })
});

app.run(function ($rootScope, $location, $route, ApiService, AuthService) {

  ApiService.loadApiVersion()

  document.querySelector('.loading').remove();

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.$$route.originalPath === '/logout') {
        AuthService.logout()
    }

    AuthService.getUserStatus()
    .then(function() {
      if (next.access && next.access.restricted && AuthService.isLoggedIn() === false) {
        $location.path('/home');
      }
    })
    .catch(function(){
        $location.path('/home');
    });
  });
});

app.controller('rootCtrl', function($scope, $timeout, AuthService, TaskService) {

  $scope.TaskService = TaskService;
  $scope.AuthService = AuthService

  $scope.$watch('$viewContentLoaded', function(){
    $timeout(initMaterializeComponents,0);

    // only call once
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
  });
});
