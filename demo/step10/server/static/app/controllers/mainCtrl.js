app.controller('mainCtrl', function($interval, $timeout, TaskService) {

  $timeout(function() {
    TaskService.loadTasks(true)
  }, 0);

});
