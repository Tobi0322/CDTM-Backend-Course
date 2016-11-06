app.factory('AuthService', function ($q, $http, $location, ApiService) {

    function register(email, password) {
      var deferred = $q.defer();

      $http.post(ApiService.hostString() + '/api/register', {email: email, password: password})
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        }).error(function (data) {
          deferred.reject();
        });
      return deferred.promise;
    }


    // return available functions for use in controllers
    return ({
      register: register
    });

});
