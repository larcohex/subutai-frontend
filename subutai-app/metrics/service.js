/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.service', [])
    .factory('metricsSrv', metricsSrv);


metricsSrv.$inject = ['$http'];

function metricsSrv($http) {
    console.log('in metrics service');
    var getMetricsTreeURL = 'subutai-app/metrics/dummy-api/metricsTree.json';

    var metricsSrv = {
        getMetricsTree: getMetricsTree
    };

    return metricsSrv;

    //// Implementation

    function getMetricsTree() {
        return $http.get(getMetricsTreeURL);
    }

}