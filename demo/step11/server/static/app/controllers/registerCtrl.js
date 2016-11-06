app.controller('registerCtrl', function ($scope, $location, AuthService) {

    $scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          alert('Successfully registered user ' + $scope.registerForm.email);
          $location.path('/');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Ooops! Something went wrong =(";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };
});
