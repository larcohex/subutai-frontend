'use strict';

angular.module('subutai.plugins.nutch.controller', [])
	.controller('NutchCtrl', NutchCtrl)
	.directive('colSelectNodes', colSelectNodes)

NutchCtrl.$inject = ['nutchSrv', 'SweetAlert', 'ngDialog'];
function NutchCtrl(nutchSrv, SweetAlert) {
	var vm = this;
	vm.loading = false;
	vm.activeTab = 'install';//
	vm.hadoopClusters = [];//
	vm.nodes = [];
	vm.nutchInstall = {};

	vm.currentCluster = {};//
	vm.nodes2Action = [];

	//functions
	vm.showContainers = showContainers;
	vm.createNutch = createNutch;
	vm.addConfigNode = addConfigNode;
	vm.addRouteNode = addRouteNode;
	vm.addDataNode = addDataNode;
	vm.getClustersInfo = getClustersInfo;
	vm.startNodes = startNodes;
	vm.stopNodes = stopNodes;
	vm.pushNode = pushNode;
	vm.addNode = addNode;
	vm.deleteNode = deleteNode;
	vm.deleteCluster = deleteCluster;
	vm.changeClusterScaling = changeClusterScaling;
	vm.sendRouter = sendRouter;
	vm.sendDataNode = sendDataNode;


	// Init
	nutchSrv.getHadoopClusters().success (function (data) {
    	vm.hadoopClusters = data;
    });


	nutchSrv.listClusters().success(function (data) {
		vm.clusters = data;
	});


	// Install


	function setDefaultValues() {
		vm.nutchInstall.nodes = [];
	}
	setDefaultValues();


	function showContainers(hadoopClusterName) {
		vm.nodes = [];
		for (var i in vm.hadoopClusters) {
			if (hadoopClusterName == vm.hadoopClusters[i]) {
				var info = nutchSrv.getHadoopClusterInfo (hadoopClusterName);
				// TODO: take nodes
			}
		}
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

	function addNewNode() {
		// TODO: list unused nodes and choose from them in a new window
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		nutchSrv.addNode(vm.currentCluster.clusterName).success(function (data) {
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
		ngDialog.open ({
			ngDialog.openConfirm({template: 'subwindow.html',
		}).then(
			function (value) {
				// TODO: add node
			},
			function (value) {
				// TODO: cancel and close ngDialog
			}
		);
		};
	});
	}
}

function colSelectNodes() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/nutch/directives/col-select/col-select-nodes.html'
	}
};
