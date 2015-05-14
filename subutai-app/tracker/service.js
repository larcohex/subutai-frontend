/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv);


trackerSrv.$inject = ['$http'];

function trackerSrv($http) {
    var getSourcesURL = 'subutai-app/tracker/dummy-api/sources.json';

    var trackerSrv = {
        getUsers: getSources
    };

    return trackerSrv;

    //// Implementation

    function getSources() {
        return $http.get(getSourcesURL);
    }

}