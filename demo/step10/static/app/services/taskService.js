app.factory('TaskService', function($q, $http, ApiService) {

    var TaskHandler = {};

    TaskHandler.tasks = [];
    TaskHandler.loading = false;

    TaskHandler.loadTasks =function() {
      var deferred = $q.defer();
      TaskHandler.loading = true;
      $http.get(ApiService.hostString() + '/api/tasks')
       .then(
           function(response){
             // success callback
             ApiService.setApiVersion(response.data.version);
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
             ApiService.setApiVersion('N/A');
             TaskHandler.loading = false;
             deferred.reject();
           }
        );
    };

    TaskHandler.addTask = function(task) {
      var deferred = $q.defer();
      $http.post(ApiService.hostString() + '/api/tasks', JSON.stringify($scope.newTask))
       .then(
           function(response){
             // success callback
             TaskHandler.tasks.push(response.data);
             deferred.resolve();
           },
           function(response){
             // failure callback
             deferred.reject();
             //TODO: View manipulation should probably happen not at this place
             shake(document.getElementById('input-card'));
           }
        );
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
             //TODO: View manipulation should probably happen not at this place
             shake(document.getElementById(task.id));
           }
        );
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
             //TODO: View manipulation should probably happen not at this place
             shake(document.getElementById(task.id));
           }
        );
    }

    //TODO:
    // uploadFile: uploadFile,
    // removeFile: removeFile

    // return available functions for use in controllers
    return TaskHandler;
});
