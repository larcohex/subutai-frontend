/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv);

trackerSrv.$inject = ['$http'];

function trackerSrv($http) {
    var modulesURL = 'http://172.16.131.205:8181/cxf/tracker/operations/sources';
    var trackerSrv = {
        getModules: getModules
    };

    return trackerSrv;

    function getModules() {
        return $http.get(modulesURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
    }

}
