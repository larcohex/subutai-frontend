'use strict';
angular.module('subutai.nodeReg.controller', [])
    .controller('NodeRegCtrl', NodeRegCtrl);

NodeRegCtrl.$inject = ['$scope', 'nodeRegSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog'];

function NodeRegCtrl($scope, nodeRegSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.action = 'install';
	vm.availableNodes = [];
	//functions
	vm.deleteNode = deleteNode;
	vm.addNode = addNode;

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


	nodeRegSrv.getData(nodeName).success(function(data){
		console.log(data,"<<<<<<<<<<<<<<<<<look here");
		vm.nodes = data;
	});
	setDefaultValues();

	function addNode(nodeName) {
		if(nodeName === undefined) return;
		SweetAlert.swal("Success!", "Node is being added.", "success");
		ngDialog.closeAll();
		nodeRegSrv.addNode(vm.currentCluster.clusterName, nodeName).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added to cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
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
				nodeRegSrv.deleteNode(vm.currentCluster.clusterName, nodeId).success(function (data) {
					SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
					getClustersInfo(vm.currentCluster.clusterName);
				}).error(function(error){
					SweetAlert.swal("ERROR!", 'Failed to delete cluster node error: ' + error.replace(/\\n/g, ' '), "error");
				});
			}
		});
	}
};

