app.controller('mainCtrl', function($timeout, AuthService, TaskService) {
  $timeout(function() {
    if (AuthService.isLoggedIn()) {
      TaskService.loadTasks()
    }
  }, 0)
});
