/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv);


trackerSrv.$inject = ['$http'];

function trackerSrv($http) {
    var getLogsURL = 'subutai-app/tracker/dummy-api/logs.json';
    var viewLogsURL = 'subutai-app/tracker/dummy-api/specificLogs.json';

    var trackerSrv = {
        getLogs: getLogs,
        getSpecificLogs: getSpecificLogs
    };

    return trackerSrv;

    //// Implementation

    function getLogs() {
        return $http.get(getLogsURL);
    }
    function getSpecificLogs() {
        return $http.get(viewLogsURL);
    }

}