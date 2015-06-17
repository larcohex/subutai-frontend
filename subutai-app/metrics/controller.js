/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', ['jsTree.directive'])
    .controller('MetricsCtrl', MetricsCtrl);

MetricsCtrl.$inject = ['metricsSrv'];
function MetricsCtrl(metricsSrv) {
    var vm = this;
    //metricsSrv.getMetricsTree().success(function (data) {
    //    vm.nodes = data;
    //})
}
