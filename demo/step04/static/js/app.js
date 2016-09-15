var app = angular.module('taskApp', []);


app.config(function($locationProvider) {
      // use the HTML5 History API
      $locationProvider.html5Mode(true).hashPrefix('!');
});


app.controller('mainCtrl', function($scope, $http, $location, $timeout) {

  var placeholders = [
    "What needs to be done?",
    "Anything else to do?",
    "Remind me about ...",
    "Don't forget about ...",
    "Remind me about ...",
    "What's on your agenda?",
  ]

  var hostString = function() {
    return 'http://' + $scope.HOST + ':' + $scope.PORT
  }

  $scope.HOST ='localhost';
  $scope.PORT = '20004';
  $scope.loading = false;
  $scope.placeholder = placeholders[Math.floor(Math.random(1337)*placeholders.length)];
  $scope.newTask = {}

  $scope.$watch('$viewContentLoaded', function(){
    $('.button-collapse').sideNav();
    $scope.HOST = $location.host()
    $scope.loadTasks()
  });

  $scope.changePort = function() {
    $scope.loadTasks()
  };

  $scope.loadTasks = function() {
    console.log('GET: ' + hostString() + '/api/tasks');
    $scope.loading = true;
    $http.get(hostString() + '/api/tasks')
     .then(
         function(response){
           // success callback
           $scope.api_version = response.data.version;
           $scope.tasks = response.data.data;
           $scope.loading = false;
         },
         function(response){
           // failure callback
           $scope.api_version = "N/A";
           $scope.tasks = [];
           console.log("Response: ");
           console.log( response);
           $scope.loading = false;
         }
      );
  };

  $scope.addTask = function () {
    console.log(JSON.stringify($scope.newTask))
    $http.post(hostString() + '/api/tasks', JSON.stringify($scope.newTask))
     .then(
         function(response){
           // success callback
           $scope.tasks.push(response.data);
           $scope.placeholder = placeholders[Math.floor(Math.random(1337)*placeholders.length)];
           $scope.newTask = {};
         },
         function(response){
           // failure callback
           console.log(response)
           var element = document.getElementById('input-card');
           element.classList.add('shake');
           element.classList.add('animated');
           $timeout(function () {
             element.classList.remove('shake');
             element.classList.remove('animated');
           }, 1000);
         }
      );
  }
});

app.controller('taskCtrl', function($scope, $http) {
  $scope.toggleTask = function() {
    if ($scope.task.status == 'normal') {
      $scope.task.status = 'completed';
    } else {
      $scope.task.status = 'normal';
    }
  }
});

app.directive('oneTask', function() {
  return {
      scope: {
          task: '=' //Two-way data binding
      },
      controller: 'taskCtrl',
      templateUrl: '/../views/task.html?13'
  };
});
