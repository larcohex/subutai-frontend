'use strict';

angular.module('subutai.monitoring.service', [])
	.factory('monitoringSrv', monitoringSrv);


monitoringSrv.$inject = ['$http'];

function monitoringSrv($http) {
	var BASE_URL = SERVER_URL + 'rest/ui/monitoring/';

	var identitySrv = {
		getTokens: getTokens,
	};

	return identitySrv;

	//// Implementation

	
	function getTokens() {
		return $http.get(TOKENS_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

}
