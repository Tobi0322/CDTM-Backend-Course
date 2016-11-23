app.factory('TaskService', function($q, $http, ApiService) {

    lists = [];
    selectedList = lists[0];
    loading = false;

    // MARK: List endpoints
    function loadLists(reload) {
      var deferred = $q.defer();
      $http.get(ApiService.hostString() + '/api/lists')
       .then(
           function(response){
             response.data.lists.forEach(function(newList) {
               if (newList.tasks == null || newList.tasks == undefined) {
                 newList.tasks = [];
               }
               var originalList = getListById(newList.id);
               if (originalList == null) {
                 lists.push(newList);
               } else if (originalList.revision < newList.revision) {
                 // replace in place
                 replaceList(originalList, newList)
               }
               // select inbox on pageload
               if(!(reload)) {
                 if (newList.inbox) selectList(newList);
               }
             });
             deferred.resolve();
           },
           function(response){
             handleErrorResponse(response);
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
        }
      });
      return selectedList;
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
    function loadTasks(shouldShowLoading, list_id) {
        var deferred = $q.defer();

        var list = getListById(list_id)
        if (list == null) {
          deferred.reject();
          return deferred.promise;
        }
        loading = shouldShowLoading;
        $http.get(ApiService.hostString() + '/api/lists/' + list.id + '/tasks')
         .then(
             function(response) {
               // success callback
               var newTasks = response.data.tasks;
               newTasks.forEach(function(newTask) {
                 // set date
                 newTask.overdue = newTask.due != null && newTask.due != '' && new Date(newTask.due) < new Date();
                 // only replace task if server side version is newer
                 var originalTask = taskForId(list, newTask.id);
                 if (originalTask == null) {
                   list.tasks.push(newTask);
                 } else if (originalTask.revision < newTask.revision) {
                   // replace in place
                   replaceTask(originalTask, newTask)
                 }
              });
               loading = false;
               deferred.resolve();
             },
             function(response){
               // failure callback
               handleErrorResponse(response);
               loading = false;
               deferred.reject();
             }
          );
        return deferred.promise;
    };

    function addTask(task, list_id) {
      var deferred = $q.defer();

      var list = getListById(list_id)
      if (list == null) {
        deferred.reject();
        return deferred.promise;
      }

      $http.post(ApiService.hostString() + '/api/lists/' + list.id + '/tasks', JSON.stringify(task))
       .then(
           function(response){
             // success callback
             list.tasks.push(response.data);
             deferred.resolve();
           },
           function(response){
             // failure callback
             handleErrorResponse(response);
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    function updateTask(task, list_id) {
      var deferred = $q.defer();

      var list = getListById(list_id)
      if (list == null) {
        deferred.reject();
        return deferred.promise;
      }

      $http.put(ApiService.hostString() + '/api/lists/' + list.id + '/tasks/' + task.id, JSON.stringify(task))
       .then(
           function(response){
             // success callback
             replaceTask(task, response.data);
             deferred.resolve();
           },
           function(response){
             // failure callback
             handleErrorResponse(response);
             deferred.reject();
           }
        );
      return deferred.promise;
    }

    function removeTask(task, list_id) {
      var deferred = $q.defer();

      var list = getListById(list_id)
      if (list == null) {
        deferred.reject();
        return deferred.promise;
      }

      $http.delete(ApiService.hostString() + '/api/lists/' + list.id + '/tasks/' + task.id)
       .then(
           function(response){
             // success callback
             list.tasks.splice(list.tasks.indexOf(task),1);
             deferred.resolve();
           },
           function(response){
             // failure callback
             handleErrorResponse(response);
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
    function getListById(list_id) {
        var ret = null;
        lists.some(function(list) {
          if (list.id === list_id) {
            ret = list;
            return;
            }
        });
        return ret;
    }

    function taskForId(list, id) {
      var ret = null;
      if (list.tasks != null && list.tasks != undefined) {
        list.tasks.some(function(task) {
          if (task.id === id) {
            ret = task;
            return;
          }
        });
      }
      return ret;
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
      task.overdue = newTask.due != null && newTask.due != '' && new Date(newTask.due) < new Date();
      task.revision = newTask.revision;
      task.starred = newTask.starred;
      task.files = newTask.files;
    }

    function replaceList(list, newList) {
      // replaces all properties of list with newList
      // list.id = newList.id;
      // list.owner = newList.owner
      list.title = newList.title;
      list.collaborators = newList.collaborators;
      list.revision = newList.revision;
    }

    function handleErrorResponse(response){
      if (response && response.data && response.data.result == false && response.data.error) {
        debug(response.data.error);
        var toastContent =$(`
        <div>
          <h5>Error</h5>
          <div>
            <strong>Status: </strong>` + response.data.error.status + `
          </div>
          <div>
            <strong>Text: </strong>` + response.data.error.text + `
          </div>
        </div>`);
        Materialize.toast(toastContent, 5000)
      }
    }

    // return available functions for use in controllers
    return ({
      lists: lists,
      selectedList: selectedList,
      loading: loading,
      selectList: selectList,
      urlForListIcon: urlForListIcon,
      loadLists: loadLists,
      // tasks
      loadTasks: loadTasks,
      addTask: addTask,
      updateTask: updateTask,
      removeTask: removeTask,
      // TODO
      uploadFiles: uploadFiles,
      removeFile: removeFile,
      fileLocation: fileLocation
    });
});
