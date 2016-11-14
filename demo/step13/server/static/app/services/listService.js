app.factory('ListService', function($q, $http, ApiService) {

  lists = []

  function loadLists() {
    var deferred = $q.defer();
    $http.get(ApiService.hostString() + '/api/lists')
     .then(
         function(response){
           lists = response.data.lists
           deferred.resolve();
         },
         function(response){
           debug(response)
           lists = [];
           deferred.reject();
         }
      );
    return deferred.promise;
  }

  // return available functions for use in controllers
  return ({
    lists: lists,
    loadLists: loadLists
  });
});
