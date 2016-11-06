app.controller('mainCtrl', function($interval, $timeout, AuthService, TaskService) {

  $timeout(function() {
    if (AuthService.isLoggedIn()) {
      TaskService.loadTasks(true)
    }
  }, 0);

  // TODO: find a better solution to busy waiting
  var loadTasks = $interval(function() {
    if (AuthService.isLoggedIn()) {
      TaskService.loadTasks(false);
    } else {
      $interval.cancel(loadTasks);
    }
  }, 10000);

});
