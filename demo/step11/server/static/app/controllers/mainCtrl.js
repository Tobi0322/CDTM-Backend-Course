app.controller('mainCtrl', function($interval, $timeout, AuthService, TaskService) {

  TaskService.loadTasks(true)

});
