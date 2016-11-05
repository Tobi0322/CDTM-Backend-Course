app.directive('oneTask', function() {
  return {
      scope: {
          task: '=' //Two-way data binding
      },
      controller: 'taskCtrl',
      templateUrl: 'app/components/oneTask/oneTask.html'
  };
});

app.controller('taskCtrl', function($scope, $rootScope, $http, $window, $timeout, $filter, ApiService, TaskService) {
  $scope.toggleTask = function() {
    if ($scope.task.status == 'normal') {
      var element = document.getElementById($scope.task.id);
      element.classList.add('completed');
      element.classList.add('fadeOutUp');
      element.classList.add('animated');
      $timeout(function() {
        $scope.task.status = 'completed';
        element.classList.remove('fadeOutUp');
        element.classList.remove('animated');
        TaskService.updateTask($scope.task)
      }, 500);
      // try {
      //   var element = document.getElementById($scope.task.id);
      //   element.classList.add('task-disappear');
      //   $timeout(function() {
      //     $scope.task.status = 'completed';
      //   }, 500);
      // } catch (e) {
      //   $scope.task.status = 'completed';
      // }
    } else {
      $scope.task.status = 'normal';
      TaskService.updateTask($scope.task)
    }

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
    $http.delete(ApiService.hostString() + '/api/tasks/' + $scope.task.id + '/files/' + file)
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
      $window.open(ApiService.hostString() + '/api/tasks/' + $scope.task.id + '/files/' + file);
    }
});
