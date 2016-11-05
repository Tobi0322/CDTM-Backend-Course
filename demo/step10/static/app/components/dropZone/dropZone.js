app.directive('dropZone', function() {
    return {
        scope: {
          task: '=' //Two-way data binding
        },
        controller: 'fileCtrl',
        restrict: 'E',
        replace: true
    };
});


app.controller('fileCtrl', function($scope, $rootScope, $element, $http) {
  $element.on('dragover', function(e) {
    this.classList.add('over');
    e.preventDefault();
    e.stopPropagation();
  });

  $element.on('dragenter', function(e) {
    this.classList.add('over');
    e.preventDefault();
    e.stopPropagation();
  });

  $element.on('dragleave', function(e) {
      this.classList.remove('over');
      this.classList.add('over');
      e.preventDefault();
      e.stopPropagation();
    });

  $element.on('drop', function(e) {
    this.classList.remove('over');
    e.preventDefault();
    e.stopPropagation();
    if (e.originalEvent.dataTransfer){
        if (e.originalEvent.dataTransfer.files.length > 0) {
            $scope.upload(e.originalEvent.dataTransfer.files);
        }
    }
    return false;
  });

  $scope.upload = function(files) {

      // took some time to figure out how to properly use append
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }

      for (var i = 0; i < files.length; i++) {
          file = files[i].name;
          file.loading = true; // Doesn't work, since a string is a primitive type in JS
          var index = $scope.task.files.indexOf(file);
          if (index > -1) {
             $scope.task.files.splice(index, 1);
          }
          $scope.task.files.unshift(file);
      }

      $http({
          method: 'POST',
          data: formData,
          url: $rootScope.hostString() + '/api/tasks/' + $scope.task.id + '/files',
          transformRequest: angular.identity, // needed to work
          headers: {
              'Content-Type': undefined // needed to work
          }
      }).success(function(response) {
        $scope.task.files = response.files;
        console.log(response);
      }).error(function(response) {
          shake(document.getElementById('modal' + $scope.task.id));
          console.log('Error uploading files.');
          console.log(response);
      });
  };

});
