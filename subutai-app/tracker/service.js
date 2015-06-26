/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.service', [])
    .factory('trackerSrv', trackerSrv)
    .filter('dateRange', function(){
        return function(input, startDate, endDate) {
            angular.forEach(input, function(obj){

                if(obj.received.getTime() >= startDate.getTime() && obj.received.getTime() <= endDate.getTime())   {
                    return obj;
                }
            });
        };
    });


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