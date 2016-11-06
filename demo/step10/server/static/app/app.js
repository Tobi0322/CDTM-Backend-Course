var app = angular.module('taskApp', ['ngRoute']);


app.config(function($locationProvider, $routeProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
    .when('/', {
      templateUrl: 'app/views/main.html',
      controller: 'mainCtrl',
    })
});

app.run(function ($rootScope, $timeout, $location, $route, ApiService) {

  ApiService.loadApiVersion()

  $timeout(function(){
    // give it some time (looks better visually)
    document.querySelector('.loading').remove();
  }, 250);
});

app.controller('rootCtrl', function($scope, $timeout, TaskService) {

  $scope.TaskService = TaskService;
  
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

  TaskService.loadTasks(true);
});
