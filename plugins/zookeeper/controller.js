'use strict';

angular.module('subutai.plugins.zookeeper.controller', [])
    .controller('ZookeeperCtrl', ZookeeperCtrl)
	.directive('colSelectZookeeperNodes', colSelectZookeeperNodes);

ZookeeperCtrl.$inject = ['$scope', 'zookeeperSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog'];

function ZookeeperCtrl($scope, zookeeperSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.activeTab = 'install';
	vm.zookeeperInstall = {};
	vm.clusters = [];
	vm.environments = [];
	vm.currentClusterNodes = [];
	vm.currentCluster = {};
	vm.availableNodes = [];
	vm.nodes2Action = [];


	//functions
	vm.getClustersInfo = getClustersInfo;	
	vm.getEnvironmentNodes = getEnvironmentNodes;
	vm.addContainer = addContainer;	
	vm.createZookeeper = createZookeeper;
	vm.deleteNode = deleteNode;;
	vm.addNode = addNode;
	vm.deleteCluster = deleteCluster;
	vm.startServer = startServer;
	vm.stopServer = stopServer;
	vm.pushNode = pushNode;
	vm.pushAll = pushAll;
	vm.changeClusterScaling = changeClusterScaling;
	vm.startNodes = startNodes;
	vm.stopNodes = stopNodes;

	zookeeperSrv.getEnvironments().success(function(data){
		vm.environments = data;
		if(vm.environments.length == 0) {
			SweetAlert.swal("ERROR!", 'No environments were found! Create environment first.', "error");
		}
	}).error(function(data){
		SweetAlert.swal("ERROR!", 'No environments were found! ERROR: ' + data, "error");
	});
	setDefaultValues();

	function getClusters() {
		zookeeperSrv.getClusters().success(function (data) {
			console.log (data);
			vm.clusters = data;
		});
	}
	getClusters();

	vm.dtOptions = DTOptionsBuilder
		.newOptions()
		.withOption('order', [[0, "asc" ]])
		.withOption('stateSave', true)
		.withPaginationType('full_numbers');

	vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2).notSortable()
	];

	function getClustersInfo(selectedCluster) {
		LOADING_SCREEN();
		vm.currentCluster = {};
		zookeeperSrv.getClusters(selectedCluster).success(function (data) {
			vm.currentCluster = data;
			console.log (vm.currentCluster.coordinator === undefined);
			console.log (vm.currentCluster);
			LOADING_SCREEN('none');
		});
	}

	function addNode() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		zookeeperSrv.addNode(vm.currentCluster.clusterName).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added on cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
		});
	}

	function getEnvironmentNodes(selectedCluster) {
		vm.currentClusterNodes = [];
		for(var i in vm.environments) {
			if(selectedCluster == vm.environments[i].id) {
				console.log (vm.environments[i]);
				for (var j = 0; j < vm.environments[i].containers.length; j++){
					if(vm.environments[i].containers[j].templateName == 'zookeeper') {
						vm.currentClusterNodes.push(vm.environments[i].containers[j]);
					}
				}
				break;
			}
		}
	}

	function createZookeeper() {
		if(vm.zookeeperInstall.clusterName === undefined || vm.zookeeperInstall.clusterName.length == 0) return;
		if(vm.zookeeperInstall.environmentId === undefined || vm.zookeeperInstall.environmentId.length == 0) return;
		SweetAlert.swal("Success!", "Zookeeper cluster start creating.", "success");
		zookeeperSrv.createZookeeper(vm.zookeeperInstall).success(function (data) {
			SweetAlert.swal("Success!", "Your Zookeeper cluster successfully created.", "success");
			getClusters();
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Zookeeper cluster create error: ' + error, "error");
		});
		setDefaultValues();
		vm.activeTab = 'manage';
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
				zookeeperSrv.deleteCluster(vm.currentCluster.clusterName).success(function (data) {
					SweetAlert.swal("Deleted!", "Cluster has been deleted.", "success");
					vm.currentCluster = {};
					getClusters();
				}).error(function(data){
					SweetAlert.swal("ERROR!", 'Delete cluster error: ' + data, "error");
				});
			}
		});
	}

	function deleteNode(nodeId) {
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
				zookeeperSrv.deleteNode(vm.currentCluster.clusterName, nodeId).success(function (data) {
					SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
					getClustersInfo(vm.currentCluster.clusterName);
				});
			}
		});
	}

	function addContainer(containerId) {
		if(vm.zookeeperInstall.nodes.indexOf(containerId) > -1) {
			vm.zookeeperInstall.nodes.splice(vm.zookeeperInstall.nodes.indexOf(containerId), 1);
		} else {
			vm.zookeeperInstall.nodes.push(containerId);
		}
	}

	function setDefaultValues() {
		vm.zookeeperInstall = {};
		vm.zookeeperInstall.domainName = "intra.lan"
		vm.zookeeperInstall.nodes = [];
		vm.zookeeperInstall.server = {};
	}


	function startServer() {
		if(vm.currentCluster.clusterName === undefined) return;
		vm.currentCluster.server.status = 'STARTING';
		zookeeperSrv.startNode (vm.currentCluster.clusterName, vm.currentCluster.server.hostname).success (function (data) {
			SweetAlert.swal("Success!", "Your server started.", "success");
			vm.currentCluster.server.status = 'RUNNING';
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Zookeeper server start error: ' + error, "error");
			vm.currentCluster.server.status = 'ERROR';
		});
	}


	function stopServer() {
		if(vm.currentCluster.clusterName === undefined) return;
		vm.currentCluster.server.status = 'STOPPING';
		zookeeperSrv.stopNode (vm.currentCluster.clusterName, vm.currentCluster.server.hostname).success (function (data) {
			SweetAlert.swal("Success!", "Your server stopped.", "success");
			vm.currentCluster.server.status = 'STOPPED';
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Zookeeper server stop error: ' + error, "error");
			vm.currentCluster.server.status = 'ERROR';
		});
	}


	function checkIfPushed(id) {
		for (var i = 0; i < vm.nodes2Action.length; ++i) {
			if (vm.nodes2Action[i].name === id) {
				return i;
			}
		}
		return -1;
	}


	function pushNode(id, type) {
		var index = checkIfPushed (id);
		if(index !== -1) {
			vm.nodes2Action.splice(index, 1);
		} else {
			vm.nodes2Action.push({name: id, type: type});
		}
	}


	function pushAll() {
		if (vm.currentCluster.coordinator !== undefined) {
			if (vm.nodes2Action.length === vm.currentCluster.workers.length + 1) {
				vm.nodes2Action = [];
			}
			else {
				vm.nodes2Action.push ({name: vm.currentCluster.nimbus.hostname, type: "nimbus"});
				for (var i = 0; i < vm.currentCluster.supervisors.length; ++i) {
					vm.nodes2Action.push ({name: vm.currentCluster.supervisors[i].hostname, type: "supervisor"});
				}
				console.log (vm.nodes2Action);
			}
		}
	}


	function changeClusterScaling (val) {
		zookeeperSrv.changeClusterScaling (vm.currentCluster.clusterName, val);
	}


	function startNodes() {
		console.log (vm.nodes2Action);
		if(vm.nodes2Action.length == 0) return;
		if(vm.currentCluster.clusterName === undefined) return;
		zookeeperSrv.startNodes(vm.currentCluster.clusterName, JSON.stringify(vm.nodes2Action)).success(function (data) {
			SweetAlert.swal("Success!", "Your cluster nodes started successfully.", "success");
			getClustersInfo(vm.currentCluster.name);
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Cluster start error: ' + error.ERROR, "error");
		});
	}


	function stopNodes() {
		if(vm.nodes2Action.length == 0) return;
		if(vm.currentCluster.clusterName === undefined) return;
		zookeeperSrv.stopNodes(vm.currentCluster.clusterName, JSON.stringify(vm.nodes2Action)).success(function (data) {
			SweetAlert.swal("Success!", "Your cluster nodes stoped successfully.", "success");
			getClustersInfo(vm.currentCluster.name);
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Cluster stop error: ' + error.ERROR, "error");
		});
	}
}

function colSelectZookeeperNodes() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/zookeeper/directives/col-select/col-select-containers.html'
	}
};

