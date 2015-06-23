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
    var timeArray = [];
    var uniqueTime = [];
    var cpuArray = [];
    var ramArray = [];
    var datasetArray = [];

    var cpuData = {};
    var ramData = {};
    var datasetData = {};

    vm.parseJsonData = parseJsonData;

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

            for(var elem = 0; elem < uniqueTime.length; elem++) {
                cpuArray.push(parseInt(chart[i].cpu, 10));
                ramArray.push(parseInt(chart[i].ram, 10));
                datasetArray.push(parseInt(chart[i].dataset, 10));
            }

        }

        cpuData = {
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(255, 0, 0,0.5)",
                    strokeColor: "rgba(255, 0, 0,1)",
                    pointColor: "rgba(255, 0, 0,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255, 0, 0,1)"
                }
            ]
        };


        ramData = {
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(0, 255, 0,0.5)",
                    strokeColor: "rgba(0, 255, 0,1)",
                    pointColor: "rgba(0, 255, 0,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(0, 255, 0,1)"
                }
            ]
        };

        datasetData = {
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(0, 255, 255,0.5)",
                    strokeColor: "rgba(0, 255, 255,1)",
                    pointColor: "rgba(0, 255, 255,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(0, 255, 255,1)"
                }
            ]
        };

        cpuData.labels = uniqueTime;
        ramData.labels = uniqueTime;
        datasetData.labels = uniqueTime;

        cpuData.datasets['data'] = cpuArray;
        ramData.datasets['data'] = ramArray;
        datasetData.datasets['data'] = datasetArray;

        console.log(cpuData.datasets['data']);
        //get context error
        var ctx1 = $("#cpuCanvas").get(0).getContext("2d");
        var ctx2 = $("#ramCanvas").get(0).getContext("2d");
        var ctx3 = $("#datasetCanvas").get(0).getContext("2d");
        new Chart(ctx1).Line(cpuData, chartOptions);
        new Chart(ctx2).Line(ramData, chartOptions);
        new Chart(ctx3).Line(datasetData, chartOptions);
    }


    $scope.selectedNode = function(e,data) {
        //this should automatically build chart
        if(data.node.id === "rh1") {
            for(var i = 0; i < vm.charts.length; i++) {
                $('#cpu').append('<p>' + vm.charts[i].time + ' ' + vm.charts[i].cpu + '</p>');
                $('#ram').append('<p>' + vm.charts[i].time + ' ' + vm.charts[i].ram + '</p>');
                $('#dataset').append('<p>' + vm.charts[i].time + ' ' + vm.charts[i].dataset + '</p>');
            }
        }
        else {
            for(var j = 0; j < vm.charts.length; j++){
                if(data.node.id === vm.charts[j].id) {
                    $('#cpu').append('<p>' + vm.charts[j].time + ' ' + vm.charts[j].cpu + '</p>');
                    $('#ram').append('<p>' + vm.charts[j].time + ' ' + vm.charts[j].ram + '</p>');
                    $('#dataset').append('<p>' + vm.charts[j].time + ' ' + vm.charts[j].dataset + '</p>');
                }
            }
        }
        //extra code needed to avoid data duplicate; where should I put this code??
        //vm.charts = '';
    }
}
