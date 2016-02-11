"use strict";

angular.module ("subutai.settings-kurjun.controller", [])
	.controller ("SettingsKurjunCtrl", SettingsKurjunCtrl);


SettingsKurjunCtrl.$inject = ["$scope", "SettingsKurjunSrv"];
function SettingsKurjunCtrl ($scope, SettingsKurjunSrv) {
	var vm = this;
	vm.config = {
		globalKurjunUrls: ["test.com", "test2.com"]
	};

	function getConfig() {
		SettingsKurjunSrv.getConfig().success (function (data) {
			vm.config = data;
		});
	}
	getConfig();


	vm.updateConfig = updateConfig;
	function updateConfig() {
		SettingsPeerSrv.updateConfig (vm.config).success (function (data) {
			SweetAlert.swal ("Success!", "Your settings were saved.", "success");
		}).error (function (error) {
			SweetAlert.swal ("ERROR!", "Save config error: " + error.replace(/\\n/g, " "), "error");
		});
	}

	vm.addUrl = addUrl;
	function addUrl() {
		vm.config.globalKurjunUrls.push ("");
	}
}