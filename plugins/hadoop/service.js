'use strict';

angular.module('subutai.plugins.hadoop.service',[])
	.factory('hadoopSrv', hadoopSrv);

hadoopSrv.$inject = ['$http', 'environmentService'];
function hadoopSrv($http, environmentService) {

	var baseURL = SERVER_URL + 'hadoop/';
	var hadoopCreateURL = baseURL + 'clusters/create';

	var hadoopSrv = {
		getHadoop: getHadoop,
		getEnvironments: getEnvironments
	};

	return hadoopSrv;

	function getHadoop() {
		return $http.get(hadoopUrl);
	}

	function getEnvironments() {
		return environmentService.getEnvironments();
	}

	function createHadoop(hadoopJson) {
		var postData = 'clusterConfJson=' + hadoopJson;
		return $http.post(
			hadoopCreateURL, 
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}
}
