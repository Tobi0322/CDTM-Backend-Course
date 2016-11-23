app.directive('listElement', function() {
    return {
        scope: {
            list: '=' //Two-way data binding
        },
        templateUrl: 'app/components/listElement/listElement.html',
        controller: 'listElementCtrl',
        restrict: 'E'
    };
});

app.controller('listElementCtrl', function($scope, $location, TaskService) {

  $scope.selectList = function() {
    TaskService.selectList($scope.list);
    $location.path('/');
  }

  $scope.urlForListIcon = function() {
    return TaskService.urlForListIcon($scope.list)
  }

  $scope.numberOfUnfinishedTasks = function() {
    var n = 0
    $scope.list.tasks.forEach(function(t) {
      if (t.status == 'normal') {
        n = n + 1;
      }
    });
    return n;
  }
});
