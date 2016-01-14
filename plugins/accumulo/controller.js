'use strict';

angular.module('subutai.plugins.accumulo.controller', [])
	.controller('AccumuloCtrl', AccumuloCtrl)
	.directive('colSelectTracers', colSelectTracers)
	.directive('colSelectSlaves', colSelectSlaves)

AccumuloCtrl.$inject = ['accumuloSrv', 'SweetAlert'];
function AccumuloCtrl(accumuloSrv, SweetAlert) {
	var vm = this;
	vm.loading = false;
	vm.activeTab = 'install';//
	vm.clusters = [];//
	vm.hadoopClusters = [];
	vm.zookeeperClusters = [];
	vm.accumuloInstall = {};
	vm.tracers = [];
	vm.slaves = [];
	vm.currentCluster = [];
	vm.currentHadoopClusterNodes = [];
	vm.currentZookeeperClusterNodes = [];
	vm.nodes2Action = [];

	//functions
	vm.getHadoopClusterNodes = getHadoopClusterNodes;
	vm.getZookeeperClusterNodes = getZookeeperClusterNodes;
	vm.createAccumulo = createAccumulo;
	vm.addTracer = addTracer;
	vm.addSlave = addSlave;
	vm.getClustersInfo = getClustersInfo;
	vm.startNodes = startNodes;
	vm.stopNodes = stopNodes;
	vm.pushNode = pushNode;
	vm.addNode = addNode;
	vm.deleteNode = deleteNode;
	vm.deleteCluster = deleteCluster;
	vm.changeClusterScaling = changeClusterScaling;
	vm.sendTracer = sendTracer;
	vm.sendTabletServer = sendTabletServer;


	// Init
	accumuloSrv.getHadoopClusters().success (function (data) {
		console.log (data);
    	vm.hadoopClusters = data;
    });


    accumuloSrv.getZookeeperClusters().success (function (data) {
		vm.zookeeperClusters = data;
	});

	accumuloSrv.listClusters().success(function (data) {
		vm.clusters = data;
	});


	// Install
	function setDefaultValues() {
		vm.accumuloInstall.tracers = [];
		vm.accumuloInstall.slaves = [];
	}
	setDefaultValues();

	function createAccumulo() {
		SweetAlert.swal("Success!", "Accumulo cluster creating started.", "success");
		accumuloSrv.createAccumulo(JSON.stringify(vm.accumuloInstall)).success(function (data) {
			SweetAlert.swal("Success!", "Accumulo cluster created.", "success");
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Accumulo cluster create error: ' + error.replace(/\\n/g, ' '), "error");
		});
	}

	function addTracer (containerId) {
		if(vm.accumuloInstall.tracers.indexOf(containerId) > -1) {
			vm.accumuloInstall.tracers.splice(vm.accumuloInstall.tracers.indexOf(containerId), 1);
		} else {
			vm.accumuloInstall.tracers.push(containerId);
		}
	}

	function addSlave (containerId) {
		if(vm.accumuloInstall.slaves.indexOf(containerId) > -1) {
			vm.accumuloInstall.slaves.splice(vm.accumuloInstall.slaves.indexOf(containerId), 1);
		} else {
			vm.accumuloInstall.slaves.push(containerId);
		}
	}

	function getHadoopClusterNodes(selectedCluster) {
		LOADING_SCREEN();
		accumuloSrv.getHadoopClusters(selectedCluster).success(function (data) {
			vm.currentHadoopClusterNodes = data.dataNodes;
			var tempArray = [];

			var nameNodeFound = false;
			var jobTrackerFound = false;
			var secondaryNameNodeFound = false;
			for(var i = 0; i < vm.currentHadoopClusterNodes.length; i++) {
				var node = vm.currentHadoopClusterNodes[i];
				if(node.hostname === data.nameNode.hostname) nameNodeFound = true;
				if(node.hostname === data.jobTracker.hostname) jobTrackerFound = true;
				if(node.hostname === data.secondaryNameNode.hostname) secondaryNameNodeFound = true;
			}
			if(!nameNodeFound) {
				tempArray.push(data.nameNode);
			}
			if(!jobTrackerFound) {
				if(tempArray[0].hostname != data.jobTracker.hostname) {
					tempArray.push(data.jobTracker);
				}
			}
			if(!secondaryNameNodeFound) {
				var checker = 0;
				for(var i = 0; i < tempArray.length; i++) {
					if(tempArray[i].hostname != data.secondaryNameNode.hostname) {
						checker++;
					}
				}
				if(checker == tempArray.length) {
					tempArray.push(data.secondaryNameNode);
				}
			}
			vm.currentHadoopClusterNodes = vm.currentHadoopClusterNodes.concat(tempArray);

			LOADING_SCREEN('none');
			console.log(vm.currentHadoopClusterNodes);
		});
	}


	function getZookeeperClusterNodes(environmentId) {
		LOADING_SCREEN();
		accumuloSrv.getZookeeperClusters(selectedCluster).success(function (data) {
			vm.currentZookeeperClusterNodes = data.nodes;
			LOADING_SCREEN('none');
			console.log(vm.currentZookeeperClusterNodes);
		});
	}

	// Manage

	function getClustersInfo(selectedCluster) {
		vm.loading = true;
		accumuloSrv.listClusters(selectedCluster).success(function (data) {
			vm.loading = false;
			vm.currentCluster = data;
		});
	}

	function startNodes() { // TODO
		if(vm.nodes2Action.length == 0) return;
		if(vm.currentCluster.clusterName === undefined) return;
		accumuloSrv.startNodes(vm.currentCluster.clusterName, JSON.stringify(vm.nodes2Action)).success(function (data) {
			SweetAlert.swal("Success!", "Your cluster nodes started successfully.", "success");
			getClustersInfo(vm.currentCluster.clusterName);
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Cluster start error: ' + error.replace(/\\n/g, ' '), "error");
		});
	}


	function stopNodes() { // TODO
		if(vm.nodes2Action.length == 0) return;
		if(vm.currentCluster.clusterName === undefined) return;
		accumuloSrv.stopNodes(vm.currentCluster.clusterName, JSON.stringify(vm.nodes2Action)).success(function (data) {
			SweetAlert.swal("Success!", "Your cluster nodes stopped successfully.", "success");
			getClustersInfo(vm.currentCluster.clusterName);
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Cluster stop error: ' + error.replace(/\\n/g, ' '), "error");
		});
	}

	function pushNode(id, type) {
		if(vm.nodes2Action.indexOf(id) >= 0) {
			vm.nodes2Action.splice(vm.nodes2Action.indexOf(id), 1);
		} else {
			vm.nodes2Action.push({name: id, type: type});
		}
	}

	function addNode() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		accumuloSrv.addNode(vm.currentCluster.clusterName).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added on cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
		});
	}

	function deleteNode(nodeId, nodeType) { // TODO
		console.log (nodeId);
		console.log (nodeType);
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this node!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#ff3f3c",
				confirmButtonText: "Delete",
				cancelButtonText: "Cancel",
				closeOnConfirm: false,
				closeOnCancel: true,
				showLoaderOnConfirm: true
				},
			function (isConfirm) {
				if (isConfirm) {
					accumuloSrv.destroyNode(vm.currentCluster.clusterName, nodeId, nodeType).success(function (data) {
						SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
						getClustersInfo(vm.currentCluster.clusterName);
					}).error(function(error){
						SweetAlert.swal("ERROR!", 'Cluster node delete error: ' + error.replace(/\\n/g, ' '), "error");
					});
				}
			}
		);
	}

	function deleteCluster() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this cluster!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#ff3f3c",
				confirmButtonText: "Delete",
				cancelButtonText: "Cancel",
				closeOnConfirm: false,
				closeOnCancel: true,
				showLoaderOnConfirm: true
			},
			function (isConfirm) {
				if (isConfirm) {
					accumuloSrv.destroyCluster(vm.currentCluster.clusterName).success(function (data) {
						SweetAlert.swal("Deleted!", "Cluster has been deleted.", "success");
						vm.currentCluster = {};
					}).error(function(error){
						SweetAlert.swal("ERROR!", 'Cluster delete error: ' + error.replace(/\\n/g, ' '), "error");
					});
				}
			}
		);
	}


	function changeClusterScaling(scale) {
		if(vm.currentCluster.clusterName === undefined) return;
		try {
			accumuloSrv.changeClusterScaling(vm.currentCluster.clusterName, scale);
		} catch(e) {}
	}


	function sendTracer() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Your Accumulo cluster started to add additional tracer.", "success");
		accumuloSrv.sendTracer(vm.currentCluster.clusterName).success (function (data) {
			SweetAlert.swal("Success!", "Tracer added.", "success");
			getClustersInfo(vm.currentCluster.clusterName);
		}).error (function (error) {
			SweetAlert.swal("ERROR!", 'Cluster error while adding tracer: ' + error.replace(/\\n/g, ' '), "error");
		});
	}


	function sendTabletServer() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Accumulo cluster started to add additional data node.", "success");
		accumuloSrv.sendTabletServer(vm.currentCluster.clusterName).success (function (data) {
			SweetAlert.swal("Success!", "Data node added.", "success");
			getClustersInfo(vm.currentCluster.clusterName);
		}).error (function (error) {
			SweetAlert.swal("ERROR!", 'Cluster error while adding data node: ' + error.ERROR, "error");
		});
	}
}

function colSelectTracers() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/accumulo/directives/col-select/col-select-tracers.html'
	}
};

function colSelectSlaves() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/accumulo/directives/col-select/col-select-slaves.html'
	}
};

