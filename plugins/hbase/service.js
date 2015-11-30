'use strict';

angular.module('subutai.plugins.hbase.service',[])
	.factory('hbaseSrv', hbaseSrv);

hbaseSrv.$inject = ['$http', 'hadoopSrv'];

function hbaseSrv($http, hadoopSrv) {
	var BASE_URL = SERVER_URL + 'rest/hbase/';
	var CLUSTER_URL = BASE_URL + 'clusters/';

	var hbaseSrv = {
		getHadoopClusters: getHadoopClusters,
		createHbase: createHbase,
		getClusters: getClusters,
		deleteNode: deleteNode,
		getAvailableNodes: getAvailableNodes,
		addNode: addNode,
		deleteCluster: deleteCluster,
	};

	return hbaseSrv;

	function addNode(clusterName, lxcHostname) {
		return $http.post(CLUSTER_URL + clusterName + '/add/node/' + lxcHostname);
	}

	function getHadoopClusters(clusterName) {
		return hadoopSrv.getClusters(clusterName);
	}

	function getClusters(clusterName) {
		if(clusterName === undefined || clusterName === null) clusterName = '';
		return $http.get(
			CLUSTER_URL + clusterName,
			{withCredentials: true, headers: {'Content-Type': 'application/json'}}
		);
	}

	function getAvailableNodes(clusterName) {
		return $http.get(
			CLUSTER_URL + clusterName + '/available/nodes',
			{withCredentials: true, headers: {'Content-Type': 'application/json'}}
		);
	}

	function deleteCluster(clusterName) {
		return $http.delete(CLUSTER_URL + 'destroy/' + clusterName);
	}

	function deleteNode(clusterName, nodeId) {
		return $http.delete(CLUSTER_URL + clusterName + '/destroy/node/' + nodeId);
	}

	function createHbase(hbaseJson) {
		var postData = 'config=' + hbaseJson;
		return $http.post(
			BASE_URL,
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}
}
