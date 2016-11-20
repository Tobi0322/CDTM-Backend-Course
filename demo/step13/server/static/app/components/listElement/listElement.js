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

app.controller('listElementCtrl', function($scope, ListService) {

  $scope.selectList = function() {
    ListService.selectList($scope.list)
  }

  $scope.urlForListIcon = function() {
    return ListService.urlForListIcon($scope.list)
  }

});
