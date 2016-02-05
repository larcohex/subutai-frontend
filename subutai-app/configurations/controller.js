"use strict";

angular.module ("subutai.configurations.controller", [])
	.controller ("ConfigurationsCtrl", ConfigurationsCtrl);


ConfigurationsCtrl.$inject = ["$scope", "ConfigurationsSrv"];
function ConfigurationsCtrl ($scope, ConfigurationsSrv) {
	var vm = this;
	vm.config = {};

	function getConfigs() {
	}

	// TODO: get configs
}