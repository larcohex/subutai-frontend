/**
 * Created by ubuntu on 5/15/15.
 */
'use strict';

angular.module('subutai.metrics.controller', [])
    .controller('MetricsCtrl', MetricsCtrl);

MetricsCtrl.$inject = ['metricsSrv'];
function MetricsCtrl(metricsSrv) {
    var vm = this;

    //vm.treeOptions = {
    //    accept: function(sourceNodeScope, destNodesScope, destIndex) {
    //        return true;
    //    }
    //};
    //metricsSrv.getMetricsTree().success(function (data) {
    //    vm.nodes = data;
    //});

}
//function nestableCtrl($scope) {
//    $scope.remove = function(scope) {
//        scope.remove();
//    };
//    $scope.toggle = function(scope) {
//        scope.toggle();
//    };
//    $scope.moveLastToTheBeginning = function () {
//        var a = $scope.data.pop();
//        $scope.data.splice(0,0, a);
//    };
//    $scope.newSubItem = function(scope) {
//        var nodeData = scope.$modelValue;
//        nodeData.nodes.push({
//            id: nodeData.id * 10 + nodeData.nodes.length,
//            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
//            nodes: []
//        });
//    };
//    $scope.collapseAll = function() {
//        $scope.$broadcast('collapseAll');
//    };
//    $scope.expandAll = function() {
//        $scope.$broadcast('expandAll');
//    };
//
//}