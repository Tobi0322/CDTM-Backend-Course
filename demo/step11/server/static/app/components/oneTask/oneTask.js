app.directive('oneTask', function() {
  return {
      scope: {
          task: '=' //Two-way data binding
      },
      controller: 'taskCtrl',
      templateUrl: 'app/components/oneTask/oneTask.html'
  };
});

app.controller('taskCtrl', function($scope, $window, $timeout, $filter, ApiService, TaskService) {
  $scope.toggleTask = function() {
    if ($scope.task.status == 'normal') {
        try {
          var element = document.getElementById($scope.task.id);
          element.classList.add('completed');
          element.classList.add('fadeOutUp');
          element.classList.add('animated');
          $timeout(function() {
            // css animation is 0.5 seconds
            $scope.task.status = 'completed';
            element.classList.remove('fadeOutUp');
            element.classList.remove('animated');
            TaskService.updateTask($scope.task)
          }, 500);
        } catch (e) {
          $scope.task.status = 'completed';
          TaskService.updateTask($scope.task)
        }
    } else {
      $scope.task.status = 'normal';
      TaskService.updateTask($scope.task)
    }

  }

  $scope.deleteTask = function() {
    TaskService.removeTask($scope.task)
      .catch(function () {
        shake(document.getElementById($scope.task.id));
      });
  }

  $scope.deleteTaskModally = function() {
    $('#modal' + $scope.task.id).closeModal();
    $scope.deleteTask($scope.task);
  }

  $scope.updateTask = function() {
    $('#modal' + $scope.task.id).closeModal();
    TaskService.updateTask($scope.task)
      .catch(function () {
        shake(document.getElementById(task.id));
      });
  }

  $scope.showDetails = function() {
     clearSelection()
     $('#modal' + $scope.task.id).openModal();
     $('#dueDate' + $scope.task.id).pickadate({
       selectMonths: true, // Creates a dropdown to control month
       selectYears: 15, // Creates a dropdown of 15 years to control year
       format: 'mmmm dd, yyyy',
       firstDay: 1,
       onSet: function(context) {
         var date = new Date($('#dueDate' + $scope.task.id)[0].value);
         $scope.task.due = $filter('date')(date, 'yyyy-MM-dd');
         $scope.task.overdue = $scope.task.due != null && $scope.task.due != '' && new Date($scope.task.due) < new Date();
       }
     });
  }

  $scope.uploadFiles = function(files) {
    TaskService.uploadFiles($scope.task, files)
      .catch(function () {
        shake(document.getElementById('modal' + $scope.task.id));
      });
  }

  $scope.removeFile = function(file) {
    TaskService.removeFile($scope.task, file);
  }

    $scope.downloadFile = function(file) {
      $window.open(TaskService.fileLocation($scope.task, file));
    }
});
