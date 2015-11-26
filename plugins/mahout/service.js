'use strict';

angular.module('subutai.plugins.mahout.service',[])
	.factory('mahoutSrv', mahoutSrv);

mahoutSrv.$inject = ['$http', 'hadoopSrv'];

function mahoutSrv($http, hadoopSrv) {
	var BASE_URL = SERVER_URL + 'rest/mahout/';
	console.log(hadoopSrv);

	var mahoutSrv = {
		getHadoopClusters: getHadoopClusters
	};

	return mahoutSrv;

	function getHadoopClusters() {
		return hadoopSrv.getClusters();
	}
}
