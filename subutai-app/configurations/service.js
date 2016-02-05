"use strict";

angular.module ("subutai.configurations.service",[])
	.factory ("ConfigurationsSrv", ConfigurationsSrv);

ConfigurationsSrv.$inject = ["$http"];

function ConfigurationsSrv ($http) {
	var ConfigurationsSrv = {
	};

	return ConfigurationsSrv;
}