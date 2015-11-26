'use strict';

angular.module('subutai.plugins.hipi.service',[])
	.factory('hipiSrv', hipiSrv);

hipiSrv.$inject = ['$http', 'hadoopSrv'];

function hipiSrv($http, hadoopSrv) {
	var BASE_URL = SERVER_URL + 'rest/hipi/';

	var hipiSrv = {
		getHadoopClusters: getHadoopClusters
	};

	return hipiSrv;

	function getHadoopClusters() {
		return hadoopSrv.getClusters();
	}
}
