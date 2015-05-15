/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', [])
    .controller('MetricsCtrl', MetricsCtrl);

MetricsCtrl.$inject = ['metricsSrv'];
function MetricsCtrl(metricsSrv) {
    var vm = this;

    vm.treeOptions = {
        accept: function(sourceNodeScope, destNodesScope, destIndex) {
            return true;
        }
    };
    metricsSrv.getMetricsTree().success(function (data) {
        vm.nodes = data;
    });

}
