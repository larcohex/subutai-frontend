/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.service', [])
    .factory('metricsSrv', metricsSrv);

metricsSrv.$inject = ['$http'];

function metricsSrv($http) {
    //var getNodesTreeURL = 'subutai-app/metrics/dummy-api/treedata.json';

    var metricsSrv = {
        //getNodesTree: getNodesTree
    };
    return metricsSrv;



    //function getNodesTree() {
    //    return $http.get(getNodesTreeURL);
    //}

}