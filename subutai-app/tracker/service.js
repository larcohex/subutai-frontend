/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv);


trackerSrv.$inject = ['$http'];

function trackerSrv($http) {
    var getLogsURL = 'subutai-app/tracker/dummy-api/logs.json';

    var trackerSrv = {
        getLogs: getLogs
    };

    return trackerSrv;

    //// Implementation

    function getLogs() {
        return $http.get(getLogsURL);
    }

}