app.factory('TaskService', function($q, $http, ApiService) {

    lists = [
      {
        title: "Inbox",
        id: 1234,
        inbox: true,
        selected: true,
        revision: 0,
        collaborators: null
      },
      {
        title: "University",
        id: 123245,
        inbox: false,
        selected: false,
        revision: 0,
        collaborators: null
      },
      {
        title: "Birthday Presents",
        id: 12345,
        inbox: false,
        selected: false,
        revision: 0,
        collaborators: null
      },
      {
        title: "Groceries",
        id: 123455,
        inbox: false,
        selected: false,
        revision: 0,
        collaborators: [123,1244]
      }
    ];
    selectedList = lists[0];
    tasks = [];
    loading = false;

    // MARK: List endpoints
    function loadLists() {
      var deferred = $q.defer();
      $http.get(ApiService.hostString() + '/api/lists')
       .then(
           function(response){
             lists.length = 0;
             response.data.lists.forEach(function(list) {
               lists.push(list);
               if (list.inbox) selectList(list);
             });
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

    function selectList(newList) {
      if (newList == null || newList == undefined) return selectedList;
      // first check whether list exists then (re)set all properties
      lists.forEach(function(list) {
        if (list.id == newList.id) {
          if (selectedList) selectedList.selected = false;
          selectedList = list;
          selectedList.selected = true;
          debug(selectedList.title)
        }
      });
      return selectedList;
    }

    function getListById(id){
      lists.forEach(function(list) {
        if (list.id === id) {
          return list
        }
      })
      return null
    }

    function urlForListIcon(list) {
      if (list.inbox) {
        return '/assets/icons/inbox.svg#icon-1'
      } else if (list.collaborators && list.collaborators.length > 0) {
        return '/assets/icons/group.svg#icon-1'
      }
      return '/assets/icons/list.svg#icon-1'
    }

    // MARK: Task Endpoints
    function loadTasks(shouldShowLoading, list) {
        var deferred = $q.defer();
        loading = shouldShowLoading;
        $http.get(ApiService.hostString() + '/api/lists/' + list.id + '/tasks')
         .then(
             function(response){
               // success callback
               var newTasks = response.data.data;
               newTasks.forEach(function(newTask) {
                 // set date
                 newTask.overdue = newTask.due != null && newTask.due != '' && new Date(newTask.due) < new Date();
                 // only replace task if server side version is newer
                 var originalTask = taskForId(list, task.id)
                 if (originalTask == null || originalTask.revision < newTask.revision) {
                   // replace in place
                   replaceTask(originalTask, newTask)
                 }
               });
               loading = false;
               deferred.resolve();
             },
             function(response){
               // failure callback
               TaskHandler.loading = false;
               deferred.reject();
             }
          );
        return deferred.promise;
    };

    function addTask(task, list) {
      var deferred = $q.defer();
      $http.post(ApiService.hostString() + '/api/lists/' + list.id + '/tasks', JSON.stringify(task))
       .then(
           function(response){
             // success callback
             debug("AddingTask")
             debug(response.data)
             list.tasks.push(response.data);
             deferred.resolve();
           },
           function(response){
             // failure callback
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    function updateTask(task) {
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

    function removeTask(task) {
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

    function uploadFiles(task, files) {
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

    function removeFile(task, file) {
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

    function fileLocation(task, file) {
      return ApiService.hostString() + '/api/tasks/' + task.id + '/files/' + file;
    }

    // MARK: Private functions
    function taskForId(list, id) {
      if (list.tasks != null && list.tasks != undefined) {
        list.tasks.forEach(function(task) {
          if (task.id === id) {
            return task;
          }
        });
      }
      return null;
    }

    function replaceTask(task, newTask) {
      // replaces all properties of task with newTask
      // task.id = newTask.id;
      // task.list = newTask.list;
      task.title = newTask.title;
      task.due = newTask.due;
      task.status = newTask.status;
      task.description = newTask.description;
      task.due = newTask.due;
      task.overdue = newTask.overdue;
      task.revision = newTask.revision;
      task.starred = newTask.starred;
      task.files = newTask.files;
    }

    // return available functions for use in controllers
    return ({
      lists: lists,
      selectedList: selectedList,
      loading: loading,
      getListById: getListById,
      selectList: selectList,
      urlForListIcon: urlForListIcon,
      loadLists: loadLists,
      // tasks
      loadTasks: loadTasks,
      addTask: addTask,
      // TODO
      updateTask: updateTask,
      removeTask: removeTask,
      uploadFiles: uploadFiles,
      removeFile: removeFile,
      fileLocation: fileLocation
    });
});
