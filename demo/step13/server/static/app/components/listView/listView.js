app.directive('listView', function() {
    return {
        templateUrl: 'app/components/listView/listView.html',
        controller: 'listViewCtrl',
        restrict: 'E'
    };
});

app.controller('listViewCtrl', function($scope, $http) {

  $scope.showCreateListModal = function () {
    $scope.newList = {};
    $('body').append($('#createListModal'));
    $('#createListModal').openModal();
  };

  $scope.createList = function (list) {
    $('#createListModal').closeModal();
    $http.post('/api/lists/', list);
  };

});
