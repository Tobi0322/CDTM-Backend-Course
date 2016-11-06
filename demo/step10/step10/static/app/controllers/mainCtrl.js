app.controller('mainCtrl', function($timeout, AuthService, TaskService) {
  $timeout(function() {
    if (AuthService.isLoggedIn()) {
      console.log('loading tasks ...')
      TaskService.loadTasks()
    }
  }, 0)
});
