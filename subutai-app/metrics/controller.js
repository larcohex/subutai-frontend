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
    var chartOptions;
    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });
    metricsSrv.getChartOptions().success(function (data) {
        chartOptions = data;
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
        //extra code needed to avoid data duplicate
        //console.log('the environment is ' + (vm.checked ? 'checked':'not checked'));
        //vm.charts = '';
    };

    /**
     * Data for cpu chart
     */
    var cpuData = {
        labels: ["9.30", "10.00", "10.30", "11.00", "11.30", "12.00", "12.30"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(255, 0, 0,0.5)",
                strokeColor: "rgba(255, 0, 0,1)",
                pointColor: "rgba(255, 0, 0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255, 0, 0,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };


    /**
     * Data for cpu chart
     */
    var ramData = {
        labels: ["9.30", "10.00", "10.30", "11.00", "11.30", "12.00", "12.30"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(0, 255, 0,0.5)",
                strokeColor: "rgba(0, 255, 0,1)",
                pointColor: "rgba(0, 255, 0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(0, 255, 0,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    /**
     * Data for cpu chart
     */
        var items = ["9.30", "10.00", "10.30", "11.00", "11.30", "12.00", "12.30"];
    var datasetData = {
        labels: items,
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(0, 255, 255,0.5)",
                strokeColor: "rgba(0, 255, 255,1)",
                pointColor: "rgba(0, 255, 255,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(0, 255, 255,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Example dataset",
                fillColor: "rgba(153, 0, 153,0.5)",
                strokeColor: "rgba(153, 0, 153,0.7)",
                pointColor: "rgba(153, 0, 153,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(153, 0, 153,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };


    var ctx1 = $("#cpuCanvas").get(0).getContext("2d");
    var myLineChart = new Chart(ctx1).Line(cpuData, chartOptions);
    var ctx2 = $("#ramCanvas").get(0).getContext("2d");
    var myLineChart = new Chart(ctx2).Line(ramData, chartOptions);
    var ctx3 = $("#datasetCanvas").get(0).getContext("2d");
    var myLineChart = new Chart(ctx3).Line(datasetData, chartOptions);
}
