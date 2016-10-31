angular.module('taskApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function login(email, password) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/login', {email: email, password: password})
        .success(function (data, status) {
          if(status === 200 && data.result){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        }).error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    }

    function logout() {
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.get('/api/logout')
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    }

    function register(email, password) {
      var deferred = $q.defer();

      $http.post('/api/register', {email: email, password: password})
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
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register
    });

}]);