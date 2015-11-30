'use strict';

angular.module('subutai.plugins.accumulo.service',[])
	.factory('accumuloSrv', accumuloSrv);

accumuloSrv.$inject = ['$http', 'hadoopSrv', 'zookeeperSrv'];

function accumuloSrv($http, hadoopSrv, zookeeperSrv) {

	var BASE_URL = SERVER_URL + 'rest/accumulo/';
	var CLUSTER_URL = BASE_URL + 'clusters/';

	var accumuloSrv = {
		listClusters: listClusters,
		destroyCluster: destroyCluster,
		startNode: startNode,
		stopNode: stopNode,
		startCluster: startCluster,
		stopCluster: stopCluster,
		destroyNode: destroyNode,
		checkNode: checkNode,
		addNode: addNode,
		getHadoopClusters: getHadoopClusters,
		getZookeeperClusters: getZookeeperClusters,
		createAccumulo: createAccumulo,
		startNodes: startNodes,
		stopNodes: stopNodes,
		sendTracer: sendTracer,
		sendTabletServer: sendTabletServer,
		changeClusterScaling: changeClusterScaling
	};

	return accumuloSrv;


	function listClusters (clusterName) {
		if (clusterName === undefined || clusterName === null) {
			clusterName = "";
		}
		return $http.get (CLUSTER_URL + clusterName, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}


	function destroyCluster (clusterName) {
		return $http.delete (CLUSTER_URL + "destroy/" + clusterName);
	}


	function startNode (clusterName, lxcHostName, nodeType) {
		return $http.put (CLUSTER_URL + clusterName + "/start/node/" + lxcHostName + "/nodeType/" + nodeType);
	}

	function startNodes(clusterName, nodesArray) {
		var postData = 'clusterName=' + clusterName + '&lxcHostNames=' + nodesArray;
		return $http.post(
			CLUSTER_URL + 'nodes/start',
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}



	function stopNode (clusterName, lxcHostName, nodeType) {
    	return $http.put (CLUSTER_URL + clusterName + "/stop/node/" + lxcHostName + "/nodeType/" + nodeType);
    }


	function stopNodes(clusterName, nodesArray) {
		var postData = 'clusterName=' + clusterName + '&lxcHostNames=' + nodesArray;
		return $http.post(
			CLUSTER_URL + 'nodes/stop',
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}


	function startCluster (clusterName) {
		return $http.put (CLUSTER_URL + clusterName + "/start");
	}


	function stopCluster (clusterName) {
    	return $http.put (CLUSTER_URL + clusterName + "/stop");
    }


	function destroyNode (clusterName, lxcHostName, nodeType) {
		return $http.delete (CLUSTER_URL + clusterName + "/destroy/node/" + lxcHostName + "/nodeType/" + nodeType);
	}


	function checkNode (clusterName, lxcHostName, nodeType) {
		return $http.get (CLUSTER_URL + clusterName + "/check/node/" + lxcHostName + "/nodeType/" + nodeType);
	}

	function addNode (clusterName, nodeType) {
		return $http.post (CLUSTER_URL + clusterName + "/add/node/nodeType/" + nodeType);
	}

	function getHadoopClusters(clusterName) {
		return hadoopSrv.getClusters(clusterName);
	}

	function getZookeeperClusters(clusterName) {
		return zookeeperSrv.getClusters(clusterName);
	}


	function changeClusterScaling(clusterName, scale) {
		console.log(scale);
		return $http.post(CLUSTER_URL + clusterName + '/auto_scale/' + scale);
	}

	function createAccumulo (accumuloJson) {
		var postData = 'clusterConfJson=' + accumuloJson;
		return $http.post(
			CLUSTER_URL + 'create',
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function sendTracer(clusterName) {
		return accumuloSrv.addNode (clusterName, "tracer");
	}

	function sendTabletServer(clusterName) {
		return accumuloSrv.addNode (clusterName, "tablet");
	}
}
