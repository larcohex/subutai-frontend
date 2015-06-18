/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.service', [])
    .factory('metricsSrv', metricsSrv);

metricsSrv.$inject = ['$http'];

function metricsSrv($http) {
    var getChartDataUrl = 'subutai-app/metrics/dummy-api/chartdata.json';
    var metricsSrv = {
        getChartData: getChartData
    };
    return metricsSrv;

    function getChartData() {
        return $http.get(getChartDataUrl);
    }
}