app.factory('ApiService', function ($location) {

    var HOST = $location.host()
    var PORT = $location.port()

    function setPort(new_port) {
      if(new_port && new_port != null && new_port != undefined && new_port != '') {
        PORT = new_port;
      }
      console.log("New port" + new_port)
    }

    function getPort() {
      return PORT
    }

    function getHost() {
      return HOST
    }

    function hostString() {
      return 'http://' + HOST + ':' + PORT
    }

    // return available functions for use in controllers
    return ({
      hostString: hostString,
      setPort: setPort,
      getPort: getPort,
      getHost: getHost,
    });

});
