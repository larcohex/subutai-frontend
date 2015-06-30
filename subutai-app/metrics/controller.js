/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', ['jsTree.directive'])
    .controller('MetricsCtrl', MetricsCtrl)
    .filter('chartID', function () {
        return function() {
            // filter function; probably we'll need it later
        }

    });

MetricsCtrl.$inject = ['metricsSrv', '$scope'];
function MetricsCtrl(metricsSrv, $scope) {
    var vm = this;
    var chartOptions;

    var timeArray = [],
        uniqueTime = [],
        cpuArray = [[]],
        ramArray = [[]],
        datasetArray = [[]],
        parsedValues = [];

    var cpuData = {},
        ramData = {},
        datasetData = {};

    var ctx1, ctx2, ctx3;

    vm.parseJsonData = parseJsonData;
    vm.buildChart = buildChart;

    metricsSrv.getChartData().success(function(data) {
        vm.charts = data;
    });

    metricsSrv.getChartOptions().success(function (data) {
        chartOptions = data;
    });


    function parseJsonData(chart) {

        for(var i = 0; i < chart.length; i++) {
            timeArray.push(chart[i].time);
            $.each(timeArray, function(i, el){
                if($.inArray(el, uniqueTime) === -1) uniqueTime.push(el);
            });


            cpuArray.push(parseInt(chart[i].cpu, 10));
            ramArray.push(parseInt(chart[i].ram, 10));
            datasetArray.push(parseInt(chart[i].dataset, 10));


        }

        console.log(cpuArray.length);

        cpuData = {
            labels: uniqueTime,
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(255, 0, 0,0.5)",
                    strokeColor: "rgba(255, 0, 0,1)",
                    pointColor: "rgba(255, 0, 0,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255, 0, 0,1)",
                    data: cpuArray
                }
            ]
        };


        ramData = {
            labels: uniqueTime,
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(0, 255, 0,0.5)",
                    strokeColor: "rgba(0, 255, 0,1)",
                    pointColor: "rgba(0, 255, 0,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(0, 255, 0,1)",
                    data: ramArray
                }
            ]
        };

        datasetData = {
            labels: uniqueTime,
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(0, 255, 255,0.5)",
                    strokeColor: "rgba(0, 255, 255,1)",
                    pointColor: "rgba(0, 255, 255,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(0, 255, 255,1)",
                    data: datasetArray
                }
            ]
        };
        return parsedValues = [uniqueTime, cpuData, ramData, datasetData];
    }

    function buildChart(parsedValuesArray, options) {
        ctx1 = $("#cpuCanvas").get(0).getContext("2d");
        ctx2 = $("#ramCanvas").get(0).getContext("2d");
        ctx3 = $("#datasetCanvas").get(0).getContext("2d");
        new Chart(ctx1).Line(parsedValuesArray[1], options);
        new Chart(ctx2).Line(parsedValuesArray[2], options);
        new Chart(ctx3).Line(parsedValuesArray[3], options);
    }

    $scope.selectedNode = function(e,data) {
        if(data.node.parent === "#") {
            for(var i = 0; i < vm.charts.length; i++) {
                buildChart(parseJsonData(vm.charts), chartOptions);
            }
        }
        else {
            for(var j = 0; j < vm.charts.length; j++){
                if(data.node.id === vm.charts[j].id) {
                    buildChart(parseJsonData(vm.charts), chartOptions);
                }
            }
        }
    }
}
