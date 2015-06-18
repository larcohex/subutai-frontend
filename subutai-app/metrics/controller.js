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

MetricsCtrl.$inject = ['metricsSrv'];
function MetricsCtrl(metricsSrv) {
    var vm = this;
    var node;
    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });

    vm.showChart = function() {
        alert('hello');
    };
    vm.selectNode = function() {
        console.log('firing function'); // tree event should have fire up here but it's not working
    }
}
