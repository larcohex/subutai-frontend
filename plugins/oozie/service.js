'use strict';

angular.module('subutai.plugins.oozie.service',[])
	.factory('oozieSrv', oozieSrv);

oozieSrv.$inject = ['$http', 'hadoopSrv'];

function oozieSrv($http, hadoopSrv) {
	var BASE_URL = SERVER_URL + 'rest/oozie/';
	var CLUSTER_URL = BASE_URL + 'clusters/';

	var oozieSrv = {
		getHadoopClusters: getHadoopClusters,
		createOozie: createOozie,
		getClusters: getClusters,
		deleteNode: deleteNode,
		getAvailableNodes: getAvailableNodes,
		addNode: addNode,
		deleteCluster: deleteCluster,
	};

	return oozieSrv;

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

	function createOozie(oozieObj) {
		console.log(oozieObj);
		var postData = 'clusterName=' + oozieObj.clusterName + '&hadoopClusterName=' + oozieObj.hadoopClusterName + '&nodes=' + JSON.stringify(oozieObj.nodes);
		return $http.post(
			CLUSTER_URL + 'install',
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function startNode (lxcHostName) {
		//$http.
	}
}
