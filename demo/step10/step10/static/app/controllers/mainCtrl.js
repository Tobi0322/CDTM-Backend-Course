app.controller('mainCtrl', function($interval, $timeout, AuthService, TaskService) {

  $timeout(function() {
    if (AuthService.isLoggedIn()) {
      TaskService.loadTasks(true)
    }
  }, 0);


  // TODO: find a better solution to busy waiting
  $interval(function() {
    console.log("Try to load tasks");
    if (AuthService.isLoggedIn()) {
      TaskService.loadTasks(false)
    }
  }, 10000);

});
