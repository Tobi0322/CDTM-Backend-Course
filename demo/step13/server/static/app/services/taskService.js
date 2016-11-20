app.factory('TaskService', function($q, $http, ApiService, ListService) {

    var TaskHandler = {};

    TaskHandler.tasks = [];
    TaskHandler.loading = false;

    TaskHandler.loadTasks = function(shouldShowLoading) {
      var deferred = $q.defer();
      TaskHandler.loading = shouldShowLoading;
      $http.get(ApiService.hostString() + '/api/tasks')
       .then(
           function(response){
             // success callback
             TaskHandler.tasks = response.data.data;
             TaskHandler.tasks.forEach(function(task) {
               task.overdue = task.due != null && task.due != '' && new Date(task.due) < new Date();
             });
             TaskHandler.loading = false;
             deferred.resolve();
           },
           function(response){
             // failure callback
             TaskHandler.tasks = [];
             TaskHandler.loading = false;
             deferred.reject();
           }
        );
      return deferred.promise;
    };

    TaskHandler.addTask = function(task) {
      var deferred = $q.defer();
      $http.post(ApiService.hostString() + '/api/tasks', JSON.stringify(task))
       .then(
           function(response){
             // success callback
             TaskHandler.tasks.push(response.data);
             deferred.resolve();
           },
           function(response){
             // failure callback
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    TaskHandler.updateTask = function(task) {
      var deferred = $q.defer();
      $http.put(ApiService.hostString() + '/api/tasks/' + task.id, JSON.stringify(task))
       .then(
           function(response){
             // success callback
             task = response.data;
             deferred.resolve();
           },
           function(response){
             // failure callback
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    TaskHandler.removeTask = function(task) {
      var deferred = $q.defer();
      $http.delete(ApiService.hostString() + '/api/tasks/' + task.id)
       .then(
           function(response){
             // success callback
             TaskHandler.tasks.splice(TaskHandler.tasks.indexOf(task),1);
             deferred.resolve();
           },
           function(response){
             // failure callback
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    TaskHandler.uploadFiles = function(task, files) {
      var deferred = $q.defer();
      // took some time to figure out how to properly use append
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }

      for (var i = 0; i < files.length; i++) {
          file = files[i].name;
          file.loading = true; // Doesn't work, since a string is a primitive type in JS
          var index = task.files.indexOf(file);
          if (index > -1) {
             task.files.splice(index, 1);
          }
          task.files.unshift(file);
      }

      TaskHandler.loading = true;
      $http({
          method: 'POST',
          data: formData,
          url: ApiService.hostString() + '/api/tasks/' + task.id + '/files',
          transformRequest: angular.identity, // needed to work
          headers: {
              'Content-Type': undefined // needed to work
          }
      }).success(function(response) {
        task.files = response.files;
        TaskHandler.loading = false;
        deferred.resolve();
      }).error(function(response) {
          TaskHandler.loading = false;
          deferred.reject();
      });

      return deferred.promise;
    }

    TaskHandler.removeFile = function(task, file) {
      var deferred = $q.defer();
      $http.delete(ApiService.hostString() + '/api/tasks/' + task.id + '/files/' + file)
       .then(
           function(response){
             // success callback
             if (response.data.result == true) {
               var index = task.files.indexOf(file);
               if (index > -1) {
                  task.files.splice(index, 1);
              }
             }
             deferred.resolve();
           },
           function(response){
             deferred.reject();
           }
        );
        return deferred.promise;
    }

    TaskHandler.fileLocation = function(task, file) {
      return ApiService.hostString() + '/api/tasks/' + task.id + '/files/' + file;
    }

    // return available functions for use in controllers
    return TaskHandler;
});
