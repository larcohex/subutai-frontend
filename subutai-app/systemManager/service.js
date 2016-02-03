"use strict";

angular.module ("subutai.system-manager.service",[])
	.factory ("SystemManagerSrv", SystemManagerSrv);

SystemManagerSrv.$inject = ["$http"];

function SystemManagerSrv ($http) {
	var SystemManagerSrv = {
	};

	return SystemManagerSrv;
}