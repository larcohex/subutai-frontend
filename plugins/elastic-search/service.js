'use strict';

angular.module('subutai.plugins.elastic-search.service',[])
	.factory('elasticSearchSrv', elasticSearchSrv);

elasticSearchSrv.$inject = ['$http', 'environmentService'];

function elasticSearchSrv($http, environmentService) {
	var BASE_URL = SERVER_URL + 'rest/elasticsearch/';
	var CLUSTER_URL = BASE_URL + 'clusters/';

	var elasticSearchSrv = {
		getEnvironments: getEnvironments,
		createElasticSearch: createElasticSearch,
		getClusters: getClusters,
		deleteNode: deleteNode,
		getAvailableNodes: getAvailableNodes,
		addNode: addNode,
		deleteCluster: deleteCluster,
	};

	return elasticSearchSrv;

	function addNode(clusterName, lxcHostname) {
		return $http.post(CLUSTER_URL + clusterName + '/add/node/' + lxcHostname);
	}

	function getEnvironments() {
		return environmentService.getEnvironments();
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

	function createElasticSearch(elasticSearchObj) {
		console.log(elasticSearchObj);
		var postData = 'clusterName=' + elasticSearchObj.clusterName + '&environmentId=' + elasticSearchObj.environmentId + '&nodes=' + JSON.stringify(elasticSearchObj.nodes);
		return $http.post(
			CLUSTER_URL + 'install',
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}
}
