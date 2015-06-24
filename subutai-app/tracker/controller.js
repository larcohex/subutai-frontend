/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.controller', [])
    .controller('TrackerCtrl', TrackerCtrl);

TrackerCtrl.$inject = ['trackerSrv'];
function TrackerCtrl(trackerSrv) {
    var vm = this;
    vm.loadOperations = loadOperations;
    vm.viewLogs = viewLogs;

    trackerSrv.getModules().success(function (data) {
        vm.modules = data;
    });
    function loadOperations() {
        vm.operations = vm.modulesDropdown.operations;
    }
    function viewLogs() {
        //$('#logsContainer').innerHTML = vm.specificOperation.logs;
        console.log(vm.specificOperation.name);
    }
}
