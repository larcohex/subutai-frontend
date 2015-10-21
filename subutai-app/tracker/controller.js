/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.controller', [])
    .controller('TrackerCtrl', TrackerCtrl);


TrackerCtrl.$inject = ['trackerSrv', '$scope'];
function TrackerCtrl(trackerSrv, $scope) {

    $scope.startDate = new Date("2015-01-01");
    $scope.endDate = new Date("2015-12-31");

    var vm = this;
    vm.loadOperations = loadOperations;
    vm.viewLogs = viewLogs;
    vm.initDataTable = initDataTable;

    trackerSrv.getModules().success(function (data) {
        vm.modules = data;
    });

    function loadOperations() {
        vm.operations = vm.modulesDropdown.operations;
    }
    function viewLogs() {
        for(var i = 0; i < vm.operations.length; i++) {
            for(var j = 0; j < vm.operations[i].logs.length; j++) {
                $('#logsContainer').append('<p>' + vm.operations[i].logs[j].date + ' ---> ' + vm.operations[i].logs[j].log + '</p>');
            }
        }
    }
    function initDataTable() {
        $('#operationsTable').DataTable({
            responsive: true
        });
    }
}
