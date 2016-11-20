app.directive('listView', function() {
    return {
        templateUrl: 'app/components/listView/listView.html',
        controller: 'listViewCtrl',
        restrict: 'E'
    };
});

app.controller('listViewCtrl', function($scope, $timeout) {
  // $('#mobile-demo').sideNav({
  //     menuWidth: 300, // Default is 240
  //     edge: 'left', // Choose the horizontal origin
  //     closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
  //     draggable: true // Choose whether you can drag to open on touch screens
  // });


});
