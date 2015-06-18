/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', ['jsTree.directive'])
    .controller('MetricsCtrl', MetricsCtrl)
    .filter('chartID', function () {
        return function() {
            //filter function goes here (decides which kxc's chart to load)
        }

    });

MetricsCtrl.$inject = ['metricsSrv', '$scope'];
function MetricsCtrl(metricsSrv, $scope) {
    var vm = this;
    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });

    vm.showChart = function() {

    };
    $scope.selectedNode = function (e, data) {
        console.log(data.node.id);
    }
}
