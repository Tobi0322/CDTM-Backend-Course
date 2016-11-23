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
        resolve: {
            logout: ['AuthService', function (AuthService) {
                AuthService.logout(true)
            }]
        }
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

app.run(function ($rootScope, $timeout, $location, $route, ApiService, AuthService) {

  var initial = true;

  ApiService.loadApiVersion()
  AuthService.getUserStatus()
    .then(function() {
      initial = false;
    })
    .catch(function() {
      initial = false;
    });

  $timeout(function(){
    // give it some time (looks better visually)
    document.querySelector('.loading').remove();
  }, 250);


  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    // Keep waiting until the userStatus was loaded
    // TODO: Implement a better solution than busy waiting
    if(initial) {
      event.preventDefault()
      $timeout(function(){
        $route.reload()
      }, 25);
    } else {
      if (next.access && next.access.restricted && AuthService.isLoggedIn() === false) {
          $location.path('/home');
      }
    }
  });

});

app.controller('rootCtrl', function($scope, $timeout, AuthService, TaskService) {

  $scope.TaskService = TaskService;
  $scope.AuthService = AuthService;

  $scope.$watch('$viewContentLoaded', function(){
    $timeout(initMaterializeComponents,0);

    $timeout(function(){
      // only call once
      $('.button-collapse').sideNav({
          menuWidth: 300, // Default is 240
          edge: 'left', // Choose the horizontal origin
          closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
          draggable: true // Choose whether you can drag to open on touch screens
      });
    },0);
  });
});
