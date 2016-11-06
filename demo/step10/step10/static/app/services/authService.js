app.factory('AuthService', function ($q, $http, ApiService) {

    // create user variable
    var user = null;

    function isLoggedIn() {
      if(user && user != null && user != undefined && user != '') {
        return true;
      } else {
        return false;
      }
    }

    function getUser() {
      return user;
    }

    function login(email, password) {
      var deferred = $q.defer();

      $http.post(ApiService.hostString() + '/api/login', {email: email, password: password})
        .success(function (data, status) {
          if(status === 200 && data.result){
            user = data.user;
            deferred.resolve();
          } else {
            user = null;
            deferred.reject();
          }
        }).error(function (data) {
          user = null;
          deferred.reject();
        });
      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();

      user = null;
      $http.get(ApiService.hostString() + '/api/logout')
        .success(function (data) {
          deferred.resolve();
        })
        .error(function (data) {
          deferred.reject();
        });
      return deferred.promise;
    }

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

    function getUserStatus() {
      return $http.get(ApiService.hostString() + '/api/status')
      .success(function (data) {
        if(data.result){
          user = data.user;
        } else {
          user = null;
        }
      })
      .error(function (data) {
        user = null;
      });
    }

    // return available functions for use in controllers
    return ({
      getUser: getUser,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus
    });

});
