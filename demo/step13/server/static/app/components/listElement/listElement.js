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

app.controller('listElementCtrl', function($scope, $resource, $location, $window, TaskService) {

  var List = $resource('/api/lists/:id', {
      'id': '@id'
    },
    {
      'save': {method: 'PUT'}
    }
  );

  $scope.selectList = function() {
    TaskService.selectList($scope.list);
    $location.path('/');
    if ($window.innerWidth < 993) {
      $('.button-collapse').sideNav('hide');
    }
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

  $scope.showDetails = function() {
    $('body').append($('#listModal' + $scope.list.id));
    $('#listModal' + $scope.list.id).openModal();
  };

  $scope.updateList = function () {

    $('#listModal' + $scope.list.id).closeModal();
    List.save($scope.list).$promise
    //ListService.updateList($scope.list)
      .catch(function () {
        shake(document.getElementById($scope.list.id));
      });
  };
});
