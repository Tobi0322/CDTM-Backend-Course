var app = angular.module('taskApp', []);

var shake = function(element) {
  try {
    element.classList.add('shake');
    element.classList.add('animated');
    setTimeout(function () {
      element.classList.remove('shake');
      element.classList.remove('animated');
    }, 1000);
  }
  catch(err) {
    // ignore
  }
}

app.config(function($locationProvider) {
      // use the HTML5 History API
      $locationProvider.html5Mode(true).hashPrefix('!');
});

app.controller('mainCtrl', function($scope, $rootScope, $http, $location) {

  var placeholders = [
    "What needs to be done?",
    "Anything else to do?",
    "Remind me about ...",
    "Don't forget about ...",
    "Remind me about ...",
    "What's on your agenda?",
  ]

  $rootScope.HOST ='localhost';
  $rootScope.PORT = '20004';

  $rootScope.hostString = function() {
    return 'http://' + $scope.HOST + ':' + $scope.PORT
  }

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
    console.log('GET: ' + $rootScope.hostString() + '/api/tasks');
    $scope.loading = true;
    $http.get($rootScope.hostString() + '/api/tasks')
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
           console.log( response);
           $scope.loading = false;
         }
      );
  };

  $scope.addTask = function () {
    console.log(JSON.stringify($scope.newTask))
    $http.post($rootScope.hostString() + '/api/tasks', JSON.stringify($scope.newTask))
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
           shake(document.getElementById('input-card'));
         }
      );
  }

  $scope.removeTask = function(task) {
    $http.delete($rootScope.hostString() + '/api/tasks/' + task.id)
     .then(
         function(response){
           // success callback
           $scope.tasks.splice($scope.tasks.indexOf(task),1);
         },
         function(response){
           // failure callback
           console.log(response)
           shake(document.getElementById(task.id));
         }
      );
  }
});

app.controller('taskCtrl', function($scope, $rootScope, $http) {
  $scope.toggleTask = function() {
    if ($scope.task.status == 'normal') {
      $scope.task.status = 'completed';
    } else {
      $scope.task.status = 'normal';
    }
  }

  $scope.deleteTask = function() {
    $scope.$parent.removeTask($scope.task);
  }
});

app.directive('oneTask', function() {
  return {
      scope: {
          task: '=' //Two-way data binding
      },
      controller: 'taskCtrl',
      templateUrl: '/../views/task.html?20'
  };
});
