"use strict";

angular.module("subutai.peer-policy.controller", [])
    .controller("PeerPolicyCtrl", PeerPolicyCtrl);


PeerPolicyCtrl.$inject = ["$scope", "PeerPolicySrv", "SweetAlert"];
function PeerPolicyCtrl($scope, PeerPolicySrv, SweetAlert) {
    var vm = this;
    vm.config = {};

    function getConfig() {
        PeerPolicySrv.getConfig().success(function (data) {
            vm.config = data;
            vm.config.peerIdHint = vm.config.diskUsageLimitHint = vm.config.cpuUsageLimitHint = vm.config.memoryUsageLimitHint = vm.config.environmentLimitHint = vm.config.containerLimitHint = false;
        });
    }

    getConfig();


    vm.updateConfig = updateConfig;
    function updateConfig() {
        PeerPolicySrv.updateConfig(vm.config).success(function (data) {
            SweetAlert.swal("Success!", "Your settings were saved.", "success");
        }).error(function (error) {
            SweetAlert.swal("ERROR!", "Save config error: " + error.replace(/\\n/g, " "), "error");
        });
    }
}