/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv);


trackerSrv.$inject = ['$http'];

function trackerSrv($http) {
    var modulesURL = 'subutai-app/tracker/dummy-api/modules.json';
    var trackerSrv = {
        getModules: getModules
    };

    return trackerSrv;

    function getModules() {
        return $http.get(modulesURL);
    }

}