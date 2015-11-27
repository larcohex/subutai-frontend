'use strict';

angular.module('subutai.plugins.nutch.service',[])
	.factory('nutchSrv', nutchSrv);

nutchSrv.$inject = ['$http', 'hadoopSrv'];

function nutchSrv($http, environmentService) {

	var BASE_URL = SERVER_URL + 'rest/nutch/';
	var CLUSTER_URL = BASE_URL + 'clusters/';

	var nutchSrv = {
		listClusters: listClusters,
		installCluster: installCluster,
		destroyCluster: destroyCluster,
		addNode: addNode,
		destroyNode: destroyNode,
		getAvailableNodes: getAvailableNodes
	};

	return nutchSrv;


	function listClusters (clusterName) { //
		if (clusterName === undefined || clusterName === null) {
			clusterName = "";
		}
		return $http.get (CLUSTER_URL + clusterName, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}


	function installCluster (clusterName, hadoopClusterName, nodes) {
		var postData = 'clusterName=' + nutchJson + "&hadoopClusterName=" + hadoopClusterName + "&nodes=" + nodes;
		return $http.post(
			CLUSTER_URL + 'install',
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}


	function destroyCluster (clusterName) {
		return $http.delete (CLUSTER_URL + clusterName);
	}


	function addNode (clusterName, lxcHostName) {
		return $http.post (CLUSTER_URL + clusterName + "/add/node/" + lxcHostName);
	}


	function destroyNode (clusterName, lxcHostName) {
		return $http.delete (CLUSTER_URL + clusterName + "/destroy/node/" + lxcHostName);
	}


	function getAvailableNodes (clusterName) {
		return $http.get (CLUSTER_URL + clusterName + "/available/nodes");
	}


	function getHadoopClusters() {
		return hadoopSrv.getClusters();
	}


	function getHadoopClusterInfo (clusterName) {
		return $http.get (SERVER_URL + "rest/hadoop/clusters/" + clusterName);
	}
}
