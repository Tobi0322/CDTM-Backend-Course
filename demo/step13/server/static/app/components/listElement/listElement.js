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

app.controller('listElementCtrl', function($scope, $http, $location, $window, ApiService, TaskService) {

  init();

  function init() {
    $scope.collaborators = [];
    // $scope.chipData = [];
    // $scope.list.collaborators = [1];
    // if($scope.list.collaborators) {
    //   $scope.list.collaborators.forEach(function(collaborator) {
    //     TaskService.getUser(collaborator)
    //       .then(function (user) {
    //         addCollaborator(user);
    //       });
    //   })
    // }
  }

  function addCollaborator(user) {
    var newCol = true;
    $scope.collaborators.some(function(oldCollaborator) {
      if (user.id === oldCollaborator.id) {
        newCol = false;
        oldCollaborator.email = user.email;
        return;
      }
    })
    if (newCol) {
      $scope.collaborators.push(user);
      $scope.chipData.push(user.email)
    }
  }

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
    if ($scope.list.inbox || TaskService.lists.indexOf($scope.list) == -1)
      return;
    $('body').append($('#listModal' + $scope.list.id));
    $('#listModal' + $scope.list.id).modal({
      ready: function() {
        $scope.list.isEditing = true;
      },
      complete: function() {
        $scope.list.isEditing = false;
      }
    });
    $('#listModal' + $scope.list.id).modal('open')

    $('.chips').material_chip({
      secondaryPlaceholder: 'Add Collaborators'
    });

    $('.chips').on('chip.add', function(e, chip){
      debug(chip);
      $('.chips').material_chip({
          'data': [
            { tag: "m "}
          ]
      });


      // you have the added chip here
    });

    $('.chips').on('chip.delete', function(e, chip){
      // you have the deleted chip here
    });
  };

  $scope.updateList = function () {
    $('#listModal' + $scope.list.id).closeModal();
    $http.put(ApiService.hostString() + '/api/lists/' + $scope.list.id, $scope.list);
  };

  $scope.deleteList = function () {
    TaskService.removeList($scope.list)
      .then(function() {
        $('#listModal' + $scope.list.id).closeModal();;
      })
      .catch(function () {
        shake(document.getElementById('listModal'));
      });
  };
});
