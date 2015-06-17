/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', ['jsTree.directive'])
    .controller('MetricsCtrl', MetricsCtrl)
    .filter('chartID', function () {
        return function() {
            //filter function goes here
        }

    });

MetricsCtrl.$inject = ['metricsSrv'];
function MetricsCtrl(metricsSrv) {
    var vm = this;
    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });
}
