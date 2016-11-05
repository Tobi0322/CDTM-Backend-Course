app.directive('taskList', function() {
    return {
        scope: {
          tasks: '=' //Two-way data binding
        },
        templateUrl: 'js/app/components/taskList/taskList.html',
        controller: 'taskListCtrl',
        restrict: 'E'
    };
});

app.controller('taskListCtrl', function($scope, $rootScope) {
  $scope.hideCompletedTasks = true;

  $scope.toggleHideCompletedTasks = function() {
    $scope.hideCompletedTasks = !$scope.hideCompletedTasks;
  }
});
