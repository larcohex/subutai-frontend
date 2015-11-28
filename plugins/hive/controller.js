'use strict';

angular.module('subutai.plugins.hive.controller', [])
    .controller('HiveCtrl', HiveCtrl)
	.directive('colSelectContainers', colSelectContainers);

HiveCtrl.$inject = ['$scope', 'hiveSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog'];

function HiveCtrl($scope, hiveSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.activeTab = 'install';
	vm.hiveInstall = {};
	vm.clusters = [];
	vm.hadoopClusters = [];
	vm.currentClusterNodes = [];
	vm.currentCluster = {};
	vm.availableNodes = [];
	vm.otherNodes = [];
	vm.temp = [];


	//functions
	vm.getClustersInfo = getClustersInfo;	
	vm.getHadoopClusterNodes = getHadoopClusterNodes;
	vm.createHive = createHive;
	vm.deleteNode = deleteNode;
	vm.addNodeForm = addNodeForm;
	vm.addNode = addNode;
	vm.deleteCluster = deleteCluster;
	vm.startServer = startServer;
	vm.stopServer = stopServer;

	hiveSrv.getHadoopClusters().success(function(data){
		vm.hadoopClusters = data;
		if(vm.hadoopClusters.length == 0) {
			SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! Create Hadoop cluster first.', "error");
		}
	}).error(function(data){
		SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! ERROR: ' + data, "error");
	});
	setDefaultValues();

	function getClusters() {
		hiveSrv.getClusters().success(function (data) {
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
		hiveSrv.getClusters(selectedCluster).success(function (data) {
			vm.temp = [1];
			vm.currentCluster = data;
			LOADING_SCREEN('none');
		});
	}

	function addNodeForm() {
		if(vm.currentCluster.clusterName === undefined) return;
		hiveSrv.getAvailableNodes(vm.currentCluster.clusterName).success(function (data) {
			vm.availableNodes = data;
		});
		ngDialog.open({
			template: 'plugins/hive/partials/addNodesForm.html',
			scope: $scope
		});
	}

	function addNode(chosenNode) {
		if(chosenNode === undefined) return;
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		ngDialog.closeAll();
		hiveSrv.addNode(vm.currentCluster.clusterName, chosenNode).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added on cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
		});
	}

	function getHadoopClusterNodes(selectedCluster) {
		LOADING_SCREEN();
		hiveSrv.getHadoopClusters(selectedCluster).success(function (data) {
			vm.currentClusterNodes = data.dataNodes;
			var tempArray = [];

			var nameNodeFound = false;
			var jobTrackerFound = false;
			var secondaryNameNodeFound = false;
			for(var i = 0; i < vm.currentClusterNodes.length; i++) {
				var node = vm.currentClusterNodes[i];
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
			vm.currentClusterNodes = vm.currentClusterNodes.concat(tempArray);

			LOADING_SCREEN('none');

		});
	}

	function createHive() {
		console.log (vm.hiveInstall);
		vm.hiveInstall.nodes = [];
		var temp = JSON.parse (vm.hiveInstall.server);
		for (var i = 0; i < vm.currentClusterNodes.length; ++i) {
			if (vm.currentClusterNodes[i].hostname !== temp.hostname) {
				vm.hiveInstall.nodes.push (vm.currentClusterNodes[i]);
			}
		}
		if(vm.hiveInstall.clusterName === undefined || vm.hiveInstall.clusterName.length == 0) return;
		if(vm.hiveInstall.hadoopClusterName === undefined || vm.hiveInstall.hadoopClusterName.length == 0) return;
		hiveSrv.createHive(vm.hiveInstall).success(function (data) {
			SweetAlert.swal("Success!", "Your hive cluster start creating.", "success");
			getClusters();
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'hive cluster create error: ' + error, "error");
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
				hiveSrv.deleteCluster(vm.currentCluster.clusterName).success(function (data) {
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
				hiveSrv.deleteNode(vm.currentCluster.clusterName, nodeId).success(function (data) {
					SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
					vm.currentCluster = {};
				});
			}
		});
	}


	function setDefaultValues() {
		vm.hiveInstall = {};
		vm.hiveInstall.nodes = [];
		vm.hiveInstall.server = {};
	}


	function startServer() {
		hiveSrv.startNode (vm.currentCluster.clusterName, vm.currentCluster.server.hostname).success (function (data) {
			SweetAlert.swal("Success!", "Your server started.", "success");
			getClusters();
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'hive server start error: ' + error, "error");
		});
	}


	function stopServer() {
		hiveSrv.stopNode (vm.currentCluster.clusterName, vm.currentCluster.server.hostname).success (function (data) {
			SweetAlert.swal("Success!", "Your server stopped.", "success");
			getClusters();
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'hive server stop error: ' + error, "error");
		});
	}
}

function colSelectContainers() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/hive/directives/col-select/col-select-containers.html'
	}
};

