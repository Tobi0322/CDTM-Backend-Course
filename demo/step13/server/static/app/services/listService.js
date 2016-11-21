app.factory('ListService', function($q, $http, ApiService) {

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

  // return available functions for use in controllers
  return ({
    lists: lists,
    getListById: getListById,
    selectList: selectList,
    selectedList: selectedList,
    urlForListIcon: urlForListIcon
    // loadLists: loadLists
  });
});
