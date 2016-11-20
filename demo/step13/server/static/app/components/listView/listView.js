app.directive('listView', function() {
    return {
        templateUrl: 'app/components/listView/listView.html',
        controller: 'listViewCtrl',
        restrict: 'E'
    };
});

app.controller('listViewCtrl', function($scope, $timeout) {

  $scope.createList = function() {
    // TODO: create list
  }

});
