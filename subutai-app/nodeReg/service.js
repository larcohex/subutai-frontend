'use strict';

angular.module('subutai.nodeReg.service',[])
	.factory('nodeRegSrv', nodeRegSrv);

nodeRegSrv.$inject = ['$http', 'hadoopSrv'];


function nodeRegSrv($http, hadoopSrv) {
	var BASE_URL = SERVER_URL + 'rest/v1/registration';

	var nodeRegSrv = {
		getData: getData
	};

	return nodeRegSrv;

	function getData(nodeName) {
		return $http.get(BASE_URL);
	}

	function deleteNode(nodeId) {
		return $http.delete(CLUSTER_URL + '/destroy/node/' + nodeId);
	}

}
