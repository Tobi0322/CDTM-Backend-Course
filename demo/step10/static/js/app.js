var app = angular.module('taskApp', []);

function shake(element) {
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

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
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
  $rootScope.PORT = '20010';

  $rootScope.hostString = function() {
    return 'http://' + $scope.HOST + ':' + $scope.PORT
  }

  $scope.loading = false;
  $scope.placeholder = placeholders[Math.floor(Math.random(1337)*placeholders.length)];
  $scope.newTask = {}
  $scope.hideCompletedTasks = true;

  $scope.$watch('$viewContentLoaded', function(){
    $('.button-collapse').sideNav();
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $scope.HOST = $location.host()
    $scope.loadTasks()
  });

  $scope.changePort = function() {
    $scope.loadTasks()
  };

  $scope.toggleHideCompletedTasks = function() {
    $scope.hideCompletedTasks = !$scope.hideCompletedTasks;
  }

  $scope.loadTasks = function() {
    $scope.loading = true;
    $http.get($rootScope.hostString() + '/api/tasks')
     .then(
         function(response){
           // success callback
           $scope.api_version = response.data.version;
           $scope.tasks = response.data.data;
           $scope.tasks.forEach(function(task) {
             task.overdue = task.due != null && task.due != '' && new Date(task.due) < new Date();
           });
           $scope.loading = false;
           console.log($scope.tasks);
         },
         function(response){
           // failure callback
           $scope.api_version = "N/A";
           $scope.tasks = [];
           console.log(response);
           $scope.loading = false;
         }
      );
  };

  $scope.addTask = function () {
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

  $scope.updateTask = function(task) {
    $http.put($rootScope.hostString() + '/api/tasks/' + task.id, JSON.stringify(task))
     .then(
         function(response){
           // success callback
           task = response.data;
         },
         function(response){
           // failure callback
           console.log(response)
           shake(document.getElementById(task.id));
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

app.controller('taskCtrl', function($scope, $rootScope, $http, $window, $filter) {
  $scope.toggleTask = function() {
    if ($scope.task.status == 'normal') {
      $scope.task.status = 'completed';
    } else {
      $scope.task.status = 'normal';
    }
    $scope.$parent.updateTask($scope.task)
  }

  $scope.deleteTask = function() {
    $scope.$parent.removeTask($scope.task);
  }

  $scope.deleteTaskModally = function() {
    $('#modal' + $scope.task.id).closeModal();
    $scope.$parent.removeTask($scope.task);
  }

  $scope.updateTask = function() {
    $('#modal' + $scope.task.id).closeModal();
    $scope.$parent.updateTask($scope.task);
  }

  $scope.showDetails = function() {
    clearSelection()
     $('#modal' + $scope.task.id).openModal();
     $('#dueDate' + $scope.task.id).pickadate({
       selectMonths: true, // Creates a dropdown to control month
       selectYears: 15, // Creates a dropdown of 15 years to control year
       format: 'mmmm dd, yyyy',
       onSet: function(context) {
         var date = new Date($('#dueDate' + $scope.task.id)[0].value);
         $scope.task.due = $filter('date')(date, 'yyyy-MM-dd');
         $scope.task.overdue = $scope.task.due != null && $scope.task.due != '' && new Date($scope.task.due) < new Date();
       }
     });
  }

  $scope.removeFile = function(file) {
    $http.delete($rootScope.hostString() + '/api/tasks/' + $scope.task.id + '/files/' + file)
     .then(
         function(response){
           // success callback
           if (response.data.result == true) {
             var index = $scope.task.files.indexOf(file);
             if (index > -1) {
                $scope.task.files.splice(index, 1);
            }
           }
         },
         function(response){
           // failure callback
           console.log(response);
         }
      );
    }

    $scope.downloadFile = function(file) {
      $window.open($rootScope.hostString() + '/api/tasks/' + $scope.task.id + '/files/' + file);
    }
});

app.controller('fileCtrl', function($scope, $rootScope, $element, $http) {
  $element.on('dragover', function(e) {
    this.classList.add('over');
    e.preventDefault();
    e.stopPropagation();
  });

  $element.on('dragenter', function(e) {
    this.classList.add('over');
    e.preventDefault();
    e.stopPropagation();
  });

  $element.on('dragleave', function(e) {
      this.classList.remove('over');
      this.classList.add('over');
      e.preventDefault();
      e.stopPropagation();
    });

  $element.on('drop', function(e) {
    this.classList.remove('over');
    e.preventDefault();
    e.stopPropagation();
    if (e.originalEvent.dataTransfer){
        if (e.originalEvent.dataTransfer.files.length > 0) {
            $scope.upload(e.originalEvent.dataTransfer.files);
        }
    }
    return false;
  });

  $scope.upload = function(files) {

      // took some time to figure out how to properly use append
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }

      $http({
          method: 'POST',
          data: formData,
          url: $rootScope.hostString() + '/api/tasks/' + $scope.task.id + '/files',
          transformRequest: angular.identity, // needed to work
          headers: {
              'Content-Type': undefined // needed to work
          }
      }).success(function(response) {
        for (var i = 0; i < files.length; i++) {
            var index = $scope.task.files.indexOf(files[i].name);
            if (index > -1) {
               $scope.task.files.splice(index, 1);
            }
            $scope.task.files.unshift(files[i].name)
        }
      }).error(function(response) {
          console.log("Error uploading files.");
          console.log(response);
      });
  };

});

app.directive('oneTask', function() {
  return {
      scope: {
          task: '=' //Two-way data binding
      },
      controller: 'taskCtrl',
      templateUrl: '/../views/task.html'
  };
});

app.directive('dropZone', function() {
    return {
        scope: {
          task: '=' //Two-way data binding
        },
        controller: 'fileCtrl',
        restrict: 'E',
        replace: true
    };
});
