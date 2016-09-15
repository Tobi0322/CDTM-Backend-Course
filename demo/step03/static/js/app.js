var app = angular.module('taskApp', []);


app.config(function($locationProvider) {
      // use the HTML5 History API
      $locationProvider.html5Mode(true).hashPrefix('!');
});


app.controller('mainCtrl', function($scope, $http, $location) {

  var placeholders = [
    "What needs to be done?",
    "Anything else to do?",
    "Remind me about ...",
    "Don't forget about ...",
    "Remind me about ...",
    "What's on your agenda?",
  ]

  $scope.HOST ='localhost';
  $scope.PORT = '20003';
  $scope.loading = false;
  $scope.placeholder = placeholders[Math.floor(Math.random(1337)*placeholders.length)];

  $scope.$watch('$viewContentLoaded', function(){
    $('.button-collapse').sideNav();
    $scope.HOST = $location.host()
    $scope.loadTasks()
  });

  $scope.changePort = function() {
    $scope.loadTasks()
  };

  $scope.loadTasks = function() {
    console.log('GET: ' + 'http://' + $scope.HOST + ':' + $scope.PORT + '/api/tasks');
    $scope.loading = true;
    $http.get('http://' + $scope.HOST + ':' + $scope.PORT + '/api/tasks')
     .then(
         function(response){
           // success callback
           $scope.api_version = response.data.version;
           $scope.tasks = response.data.data;
           $scope.loading = false;
         },
         function(response){
           // failure callback
           $scope.api_version = "N/A"
           $scope.tasks = ""
           console.log("Response: ");
           console.log( response);
           $scope.loading = false;
         }
      );
  };

  $scope.addTask = function () {
    // TODO: POST to server
    console.log($scope.newTask);
    var task = {
      title: $scope.newTask,
      status: 'normal'
    }
    $scope.tasks.push(task);
    $scope.placeholder = placeholders[Math.floor(Math.random(1337)*placeholders.length)];
    $scope.newTask = "";
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
