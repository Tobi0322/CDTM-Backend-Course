app.controller('registerCtrl', function ($scope, $location, AuthService) {

    if (AuthService.isLoggedIn()) {
      $location.path('/');
    }

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          AuthService.login($scope.registerForm.email,
                             $scope.registerForm.password)
            .then(function() {
              $location.path('/');
              $scope.disabled = false;
              $scope.registerForm = {};
            })
            .catch(function() {
              $location.path('/login');
              $scope.disabled = false;
              $scope.registerForm = {};
            })
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
