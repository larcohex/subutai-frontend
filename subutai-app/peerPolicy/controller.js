"use strict";

angular.module ("subutai.peer-policy.controller", [])
	.controller ("PeerPolicyCtrl", PeerPolicyCtrl);


PeerPolicyCtrl.$inject = ["$scope", "PeerPolicySrv"];
function PeerPolicyCtrl ($scope, PeerPolicySrv) {
	var vm = this;
	vm.config = {
		peerId: "42",
		diskUsageLimit: "2",
		cpuUsageLimit: "1.5",
		memoryUsageLimit: "4000",
		//networkUsageLimit: "100 Mbps",
		environmentLimit: "3",
		containerLimit: "5"
	};

	function getConfig() {
		PeerPolicySrv.getConfig().success (function (data) {
			vm.config = data;
		});
	}
//	getConfig();


	vm.updateConfig = updateConfig;
	function updateConfig() {
		SettingsPeerSrv.updateConfig (vm.config).success (function (data) {
			SweetAlert.swal ("Success!", "Your settings were saved.", "success");
		}).error (function (error) {
			SweetAlert.swal ("ERROR!", "Save config error: " + error.replace(/\\n/g, " "), "error");
		});
	}
}