"use strict";

angular.module ("subutai.system-manager.controller", [])
	.controller ("SystemManagerCtrl", SystemManagerCtrl);


SystemManagerCtrl.$inject = ["$scope", "SystemManagerSrv"];
function SystemManagerCtrl ($scope, SystemManagerSrv) {
	var vm = this;
	vm.activeTab = "config";


	// TODO: get configs
	// TODO: get updates
}