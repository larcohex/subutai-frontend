'use strict';

angular.module('subutai.plugins.nutch.controller', [])
	.controller('NutchCtrl', NutchCtrl)
	.directive('colSelectNodes', colSelectNodes)

NutchCtrl.$inject = ["$scope", 'nutchSrv', 'SweetAlert', 'ngDialog'];
function NutchCtrl ($scope, nutchSrv, SweetAlert, ngDialog) {
	var vm = this;
	vm.loading = false;
	vm.activeTab = 'install';//
	vm.hadoopClusters = [];//
	vm.nodes = [];
	vm.nutchInstall = {};

	vm.currentCluster = {};//
	vm.nodes2Action = [];

	vm.availableNodes = [];

	//functions
	vm.showContainers = showContainers;
	vm.createNutch = createNutch;
	vm.showContainers = showContainers;
	vm.addNode = addNode;
	vm.getClustersInfo = getClustersInfo;
	vm.pushNode = pushNode;
	vm.addNewNode = addNewNode;
	vm.deleteNode = deleteNode;
	vm.deleteCluster = deleteCluster;
	vm.openSubwindow = openSubwindow;

	// Init

	nutchSrv.listClusters().success(function (data) {
		vm.clusters = data;
	});


	nutchSrv.getHadoopClusters().success (function (data) {
    	vm.hadoopClusters = data;
    	if(vm.hadoopClusters.length == 0) {
			SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! Create Hadoop cluster first.', "error");
		}
	}).error(function(data){
		SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! ERROR: ' + data, "error");
	});


	// Install


	function setDefaultValues() {
		vm.nutchInstall.nodes = [];
	}
	setDefaultValues();


	function showContainers (hadoopClusterName) {
		LOADING_SCREEN();
		hipiSrv.getHadoopClusters (hadoopClusterName).success(function (data) {
			vm.nodes = data.dataNodes;

			var nameNodeFound = false;
			var jobTrackerFound = false;
			var secondaryNameNodeFound = false;
			for(var i = 0; i < vm.nodes.length; i++) {
				var node = vm.nodes[i];
				if(node.hostname === data.nameNode.hostname) nameNodeFound = true;
				if(node.hostname === data.jobTracker.hostname) jobTrackerFound = true;
				if(node.hostname === data.secondaryNameNode.hostname) secondaryNameNodeFound = true;
			}

			if(!nameNodeFound) {
				vm.nodes.push(data.nameNode);
			}
			if(!jobTrackerFound) {
				vm.nodes.push(data.jobTracker);
			}
			if(!secondaryNameNodeFound) {
				vm.nodes.push(data.secondaryNameNode);
			}

			LOADING_SCREEN('none');
			console.log ("list of nodes");
			console.log(vm.nodes);
		});
	}


	function addNode (containerId) {
		if(vm.nutchInstall.nodes.indexOf(containerId) > -1) {
			vm.nutchInstall.nodes.splice(vm.nutchInstall.nodes.indexOf(containerId), 1);
		} else {
			vm.nutchInstall.nodes.push(containerId);
		}
	}


	function createNutch() {
		nutchSrv.installCluster(vm.nutchInstall.name, vm.nutchInstall.hadoopClusterName, vm.nutchInstall.nodes).success(function (data) {
			SweetAlert.swal("Success!", "Your Nutch cluster started creating.", "success");
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Nutch cluster create error: ' + error.ERROR, "error");
		});
	}


	// Manage

	function getClustersInfo(selectedCluster) {
		vm.loading = true;
		nutchSrv.listClusters(selectedCluster).success(function (data) {
			vm.loading = false;
			vm.currentCluster = data;
			console.log(vm.currentCluster);
		});
	}


	function pushNode(id) {
		if(vm.nodes2Action.indexOf(id) >= 0) {
			vm.nodes2Action.splice(vm.nodes2Action.indexOf(id), 1);
		} else {
			vm.nodes2Action.push(id);
		}
	}

	function addNewNode (lxcHostName) {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		nutchSrv.addNode(vm.currentCluster.clusterName, lxcHostName).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added on cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
		});
	}

	function deleteNode(nodeId, nodeType) {
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
					nutchSrv.destroyNode(vm.currentCluster.clusterName, nodeId, nodeType).success(function (data) {
						SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
						vm.currentCluster = {};
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
					nutchSrv.destroyCluster(vm.currentCluster.clusterName).success(function (data) {
						SweetAlert.swal("Deleted!", "Cluster has been deleted.", "success");
						vm.currentCluster = {};
					});
				}
			}
		);
	}


	function openSubwindow() {
		if(vm.currentCluster.clusterName === undefined) return;
		hipiSrv.getAvailableNodes(vm.currentCluster.clusterName).success(function (data) {
			vm.availableNodes = data;
			console.log(vm.availableNodes);
		});
		ngDialog.open({
			template: 'plugins/nutch/partials/subwindow.html',
			scope: $scope
		});
	}
}

function colSelectNodes() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/nutch/directives/col-select/col-select-nodes.html'
	}
};
