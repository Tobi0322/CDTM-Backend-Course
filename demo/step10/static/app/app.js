var app = angular.module('taskApp', ['ngRoute']);

function shake(element) {
  try {
    element.classList.add('shake');
    element.classList.add('long');
    element.classList.add('animated');
    setTimeout(function () {
      element.classList.remove('shake');
      element.classList.remove('long');
      element.classList.remove('animated');
    }, 1000);
  }
  catch(err) {
    // ignore
  }
}

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}

function initMaterializeComponents() {
  try {
    // the 'href' attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $('.parallax').parallax();
  } catch(err) {
    // ignore
  }
}

app.config(function($locationProvider, $routeProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
    .when('/', {
      templateUrl: '/views/main.html',
      access: {restricted: true}
    })
    .when('/home', {
      templateUrl: '/views/landing.html',
      controller: 'homeCtrl',
      access: {restricted: false}
    })
    .when('/logout', {
      redirectTo: '/'
    })
    .when('/login', {
      templateUrl: '/views/login.html',
      controller: 'loginCtrl',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
});

app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.$$route.originalPath === '/logout') {
        AuthService.logout()
    }

    AuthService.getUserStatus().then(function() {
      if (next.access && next.access.restricted && AuthService.isLoggedIn() === false) {
        $location.path('/home');
      }
    });
  });
});

app.controller('mainCtrl', function($scope, $rootScope, $http, $location, $timeout, AuthService, ApiService, TaskService) {

  $scope.TaskService = TaskService;

  $scope.isLoggedIn = function() {
    return AuthService.isLoggedIn();
  }
  $scope.user = function() {
    return AuthService.getUser();
  }

  $scope.$watch('$viewContentLoaded', function(){
    $timeout(initMaterializeComponents,0);

    // only call once
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });

    TaskService.loadTasks();
  });
});
