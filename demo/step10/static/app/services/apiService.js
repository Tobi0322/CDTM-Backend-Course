app.factory('ApiService', function ($location) {

    var HOST = $location.host();
    var PORT = $location.port();
    var VERSION = 'N/A';

    function setPort(new_port) {
      if(new_port && new_port != null && new_port != undefined && new_port != '') {
        PORT = new_port;
      }
    }

    function getPort() {
      return PORT;
    }

    function getHost() {
      return HOST;
    }

    function hostString() {
      return 'http://' + HOST + ':' + PORT;
    }

    function getApiVersion() {
      return VERSION;
    }

    function setApiVersion(new_version) {
      VERSION = new_version;
    }

    // return available functions for use in controllers
    return ({
      hostString: hostString,
      setPort: setPort,
      getPort: getPort,
      getHost: getHost,
      getApiVersion: getApiVersion,
      setApiVersion: setApiVersion
    });

});
