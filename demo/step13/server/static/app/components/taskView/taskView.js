app.directive('taskView', function() {
  return {
      scope: {
          list: '=' //Two-way data binding
      },
      controller: 'taskViewCtrl',
      templateUrl: 'app/components/taskView/taskView.html'
  };
});

app.controller('taskViewCtrl', function($scope, ListService) {
  $scope.urlForListIcon = function() {
    return ListService.urlForListIcon($scope.list)
  }
});
