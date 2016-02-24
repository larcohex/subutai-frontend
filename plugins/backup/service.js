"use strict";

angular.module ("subutai.plugins.backup.service",[])
	.factory ("backupSrv", backupSrv);

backupSrv.$inject = ["$http", "environmentService"];


function backupSrv ($http, environmentService) {
	var backupSrv = {
		getEnvironments: getEnvironments
	};


	function getEnvironments() {
		return environmentService.getEnvironments();
	}

	return backupSrv;
}