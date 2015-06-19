/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', ['jsTree.directive'])
    .controller('MetricsCtrl', MetricsCtrl)
    .filter('chartID', function () {
        return function() {
            // filter function
        }

    });

MetricsCtrl.$inject = ['metricsSrv', '$scope'];
function MetricsCtrl(metricsSrv, $scope) {
    var vm = this;
    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });

    $scope.selectedNode = function (e, data) {
        if(data.node.id === "rh1") {
            for(var i = 0; i < vm.charts.length; i++) {
                $('#cpu').append('<p>' + vm.charts[i].cpu + '</p>');
                $('#ram').append('<p>' + vm.charts[i].ram + '</p>');
                $('#dataset').append('<p>' + vm.charts[i].dataset + '</p>');
            }
        }
        else {
            for(var j = 0; j < vm.charts.length; j++){
                if(data.node.id === vm.charts[j].id) {
                    $('#cpu').append('<p>' + vm.charts[j].cpu + '</p>');
                    $('#ram').append('<p>' + vm.charts[j].ram + '</p>');
                    $('#dataset').append('<p>' + vm.charts[j].dataset + '</p>');
                }
            }
        }
        vm.charts = '';
    }
}
